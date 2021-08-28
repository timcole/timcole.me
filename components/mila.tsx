import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { timeSince } from '../lib/time';
import Article from './article';
import Chart from './chart';

type History = { time: Date; data: number };

// FIXME: Don't keep this solo param but need to move snake SSE into a context
const Mila: FC<{ solo?: boolean }> = ({ solo }) => {
  const [degree, setDegree] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  const [heater, setHeater] = useState<boolean>(false);
  const [historyTemp, setHistoryTemp] = useState<History[]>();
  const [historyHumidity, setHistoryHumidity] = useState<History[]>();

  useEffect(() => {
    if (historyTemp && degree !== 0 && historyTemp.slice(-1)[0].data !== degree)
      setHistoryTemp([...historyTemp, { time: new Date(), data: degree }]);
  }, [historyTemp, degree]);

  useEffect(() => {
    if (
      historyHumidity &&
      humidity !== 0 &&
      historyHumidity.slice(-1)[0].data !== humidity
    )
      setHistoryHumidity([
        ...historyHumidity,
        { time: new Date(), data: humidity },
      ]);
  }, [historyHumidity, humidity]);

  useEffect(() => {
    const sse = new EventSource(`/api/snake`);

    sse.addEventListener('current:temp', ({ data }: MessageEvent) => {
      const deg = JSON.parse(data);
      setDegree(Math.round(deg));
    });

    sse.addEventListener('current:humidity', ({ data }: MessageEvent) => {
      const hum = JSON.parse(data);
      setHumidity(Math.round(hum));
    });

    sse.addEventListener('current:heater', ({ data }: MessageEvent) =>
      setHeater(JSON.parse(data) === '1'),
    );

    sse.addEventListener('chart:temp', ({ data }: MessageEvent) => {
      const history = JSON.parse(data).map(([ts, data]) => ({
        time: ts * 1000,
        data,
      }));
      setHistoryTemp(history);
    });

    sse.addEventListener('chart:humidity', ({ data }: MessageEvent) => {
      const history = JSON.parse(data).map(([ts, data]) => ({
        time: ts * 1000,
        data,
      }));
      setHistoryHumidity(history);
    });

    return () => {
      sse.close();
    };
  }, []);

  return (
    <>
      {solo && (
        <Link href="/">
          <Name>Go back...</Name>
        </Link>
      )}
      <Article
        image="https://cdn.t.pics/snek-loading.png"
        stream="https://mila-is-the-best.tim.rip/snek-cam/stream.m3u8"
      >
        <h2>
          Hi, I'm{' '}
          <Link href="/mila">
            <a>
              <Name>Mila</Name>
            </a>
          </Link>
          !
        </h2>
        <p>
          I am <span>{timeSince(new Date('5 July 2021'))} old</span>, born on
          5th July 2021. Ball Python, <i>Half Het Albino/Het Piebald</i>.
        </p>
        <p>
          It is currently <span>{degree}°F</span>, with a humidity of{' '}
          <span>{humidity}%H</span> in my terrarium.
        </p>
        <p>
          My heater is currently <span>{heater ? 'ON' : 'OFF'}</span>.
        </p>
      </Article>
      {solo && (
        <>
          <Chart
            data={historyTemp}
            suffix="°F"
            name="Temperature"
            references={[
              { label: 'Dangerously Hot', yStart: 95, yEnd: 105, color: 'red' },
              { label: 'Getting Hot', yStart: 90, yEnd: 95, color: 'orange' },
              {
                label: 'Great Temperature',
                yStart: 80,
                yEnd: 90,
                color: 'green',
              },
              { label: 'Getting Cold', yStart: 75, yEnd: 80, color: 'orange' },
              {
                label: 'Dangerously Cold',
                yStart: 60,
                yEnd: 75,
                color: 'orange',
              },
            ]}
          />
          <Chart
            data={historyHumidity}
            suffix="%H"
            name="Humidity"
            references={[
              {
                label: 'Is it a rain forest in here..?',
                yStart: 90,
                yEnd: 100,
                color: 'red',
              },
              {
                label: 'Okay for a short period.',
                yStart: 80,
                yEnd: 90,
                color: 'orange',
              },
              { label: 'Great Humidity', yStart: 50, yEnd: 80, color: 'green' },
              { label: 'Getting Dry', yStart: 45, yEnd: 50, color: 'orange' },
              { label: 'Way too dry', yStart: 0, yEnd: 45, color: 'orange' },
            ]}
          />
        </>
      )}
    </>
  );
};

export default Mila;

const Name = styled.b`
  border-bottom: 2px solid var(--accent);
`;
