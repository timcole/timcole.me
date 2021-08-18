import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import { About } from '../components/about';
import Launch, { Props as LaunchProps } from '../components/launch';
import NowPlaying from '../components/playing';
import Setup from '../components/setup';
import Programming from '../components/programming';
// import Mila from '../components/mila';

const Mila = dynamic(() => import('../components/mila'), { ssr: false });

type Props = {
  nextLaunch?: LaunchProps;
};

const Index: NextPage<Props> = ({ nextLaunch }) => {
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
    filters: [{field: net, operation: greaterThan, value: "NOW()"}]
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

  return { props: { nextLaunch } };
};

export default Index;
