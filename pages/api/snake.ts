import { IncomingMessage, ServerResponse } from 'http';
import { randomBytes } from 'crypto';

const HUMIDITY_QUERY = `sum by (device) (govee_hum)`;
const TEMP_QUERY = `sum by (device) (govee_temp)`;
const HEATER_QUERY = `govee_plug{device="12:e2:34:20:03:93:a7:7d"}`;

const init_cache = { t: null, d: [] };
const clients: Map<String, ServerResponse> = new Map();

setInterval(async () => {
  if (clients.size === 0) return;

  const [[, humidity], [, temp], [, heat]] = await Promise.all([
    fetchStats(HUMIDITY_QUERY, false),
    fetchStats(TEMP_QUERY, false),
    fetchStats(HEATER_QUERY, false),
  ]);

  clients.forEach((client) => {
    writeEvent(client, 'current:humidity', humidity);
    writeEvent(client, 'current:temp', temp);
    writeEvent(client, 'current:heater', heat);
  });
}, 2000);

export default async (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Content-Encoding': 'none',
  });

  const id = randomBytes(20).toString('hex');
  clients.set(id, res);
  const heartbeat = setInterval(() => res.write(`:ping\n\n`), 30000);

  try {
    let [humidity, temp] = init_cache.d;
    if (
      !init_cache.t ||
      new Date().getTime() - init_cache.t.getTime() >= 10000
    ) {
      [humidity, temp] = await Promise.all([
        fetchStats(HUMIDITY_QUERY),
        fetchStats(TEMP_QUERY),
      ]);
      init_cache.t = new Date();
      init_cache.d = [humidity, temp];
    }

    writeEvent(res, 'chart:humidity', humidity);
    writeEvent(res, 'chart:temp', temp);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: true }));
  }

  req.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(id);
    req.destroy();
  });
};

function writeEvent(res: ServerResponse, event: string, data: any) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

async function fetchStats(query: string, day: boolean = true) {
  let now = new Date().getTime();
  now /= Math.pow(10, 3);
  const { status, data } = await fetch(
    `http://prometheus-server.nginx:9090/api/v1/${
      day
        ? `query_range?query=${query}&start=${now - 86_400}&end=${now}&step=345`
        : `query?query=${query}&time=${now}`
    }`,
  ).then((data) => data.json());

  if (status !== 'success') return Promise.reject('failed_to_query_prom');

  return data.result[0][day ? 'values' : 'value'] || [];
}
