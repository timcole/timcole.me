import { IncomingMessage, ServerResponse } from 'http';

const api = 'https://api.socialblade.com/v2/search?query=modesttim&api=';

export default async (_: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    res.statusCode = 200;
    res.end(
      await fetch(api + process.env.SOCIALBLADE_AUTH).then((stats) =>
        stats.text()
      )
    );
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: true }));
  }
};
