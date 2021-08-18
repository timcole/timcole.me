import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { timeSince } from '../lib/time';
import Article from './article';

const Mila: FC = () => {
  const [degree, setDegree] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  const [heater, setHeater] = useState<boolean>(false);

  useEffect(() => {
    const sse = new EventSource(`/api/snake`);

    sse.addEventListener('current:temp', ({ data }: MessageEvent) =>
      setDegree(Math.round(JSON.parse(data))),
    );

    sse.addEventListener('current:humidity', ({ data }: MessageEvent) =>
      setHumidity(Math.round(JSON.parse(data))),
    );

    sse.addEventListener('current:heater', ({ data }: MessageEvent) => {
      setHeater(JSON.parse(data) === '1' ? true : false);
    });

    return () => {
      sse.close();
    };
  }, []);

  return (
    <>
      <Article
        image="https://cdn.t.pics/snek-loading.png"
        stream="https://mila-is-the-best.tim.rip/snek-cam/stream.m3u8"
      >
        <h2>
          Hi, I'm <Name>Mila</Name>!
        </h2>
        <p>
          I am <span>{timeSince(new Date('14 July 2021'))} old</span>, born on
          14th July 2021. Ball Python, <i>Half Het Albino/Het Piebald</i>.
        </p>
        <p>
          It is currently <span>{degree}°F</span>, with a humidity of{' '}
          <span>{humidity}%H</span> in my terrarium.
        </p>
        <p>
          My heater is currently <span>{heater ? 'ON' : 'OFF'}</span>.
        </p>
      </Article>
    </>
  );
};

export default Mila;

const Name = styled.b`
  border-bottom: 2px solid var(--accent);
`;
