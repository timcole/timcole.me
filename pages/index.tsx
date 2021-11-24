import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import { About } from '../components/about';
import Launch, { Props as LaunchProps } from '../components/launch';
import NowPlaying from '../components/playing';
import Setup from '../components/setup';
import Programming from '../components/programming';
import Mila from '../components/mila';
import { Presence } from '../types/lanyard';
import { useLanyard } from '../components/lanyard';
import { useEffect } from 'react';

type Props = {
  nextLaunch?: LaunchProps;
  lanyard?: Presence;
};

const Index: NextPage<Props> = ({ nextLaunch, lanyard }) => {
  const [, setDoing] = useLanyard();

  useEffect(() => {
    setDoing(lanyard);
  }, [lanyard]);

  return (
    <div>
      <Head>
        <title>Timothy Cole - Software Engineer</title>
      </Head>
      <About />
      {nextLaunch ? <Launch {...nextLaunch} /> : ''}
      <Mila />
      <Setup />
      <Programming />
      <NowPlaying />
    </div>
  );
};

const nextLaunchQuery = `
query {
  launches(
    limit: 1
    orderBy: {field: net, direction: ASC}
    filters: [{field: net, operation: gt, date: "NOW()"}]
  ) {
    id
    net
    status
  }
}
`;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  let nextLaunch = null;
  try {
    const {
      data: { launches },
    } = await fetch(`https://booster.spaceflight.live`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ query: nextLaunchQuery }),
    }).then((data) => data.json());

    nextLaunch = launches[0];
  } catch (e) {
    console.error(e);
  }

  const lanyard: Presence = (
    await fetch('https://api.lanyard.rest/v1/users/83281345949728768').then(
      (data) => data.json(),
    )
  ).data;

  return { props: { nextLaunch, lanyard } };
};

export default Index;
