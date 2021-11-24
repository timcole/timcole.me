import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { timeSince } from '../lib/time';
import Article from './article';
import { useLanyard } from './lanyard';

type MilaData = {
  temperature: number;
  humidity: number;
  heater: { lamp: boolean; pad: boolean };
  stream: string;
};

const Mila: FC = () => {
  const [doing] = useLanyard();
  const [mila, setMila] = useState<MilaData | undefined>();

  useEffect(() => {
    if (!doing?.kv?.mila) return () => {};
    setMila(JSON.parse(doing.kv.mila));
  }, [doing]);

  if (!mila) return <></>;

  return (
    <Article image="https://cdn.t.pics/snek-loading.png" stream={mila.stream}>
      <h2>
        Hi, I'm <Name>Mila</Name>!
      </h2>
      <p>
        I am <span>{timeSince(new Date('5 July 2021'))} old</span>, born on 5th
        July 2021. Ball Python, <i>Half Het Albino/Het Piebald</i>.
      </p>
      <p>
        It is currently <span>{mila.temperature.toFixed(1)}°F</span>, with a
        humidity of <span>{mila.humidity.toFixed(1)}%H</span> in my terrarium.
      </p>
      <p>
        Heat pad <span>{mila.heater.pad ? 'ON' : 'OFF'}</span>, lamp{' '}
        <span>{mila.heater.lamp ? 'ON' : 'OFF'}</span>
      </p>
      <p>
        Updates on{' '}
        <a
          href="https://www.instagram.com/stories/highlights/17920168666864385/"
          target="_blank"
        >
          Instagram Stories
        </a>
      </p>
    </Article>
  );
};

export default Mila;

const Name = styled.b`
  border-bottom: 2px solid var(--accent);
`;
