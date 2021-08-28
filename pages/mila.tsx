import { NextPage } from 'next';
import Head from 'next/head';

import Mila from '../components/mila';

const MilaPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Mila the Snake - Timothy Cole's Ball Python</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐍</text></svg>"
        />
      </Head>
      <Mila solo={true} />
    </div>
  );
};

export default MilaPage;
