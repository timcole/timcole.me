import { NextPage } from 'next';
import styled from 'styled-components';
import Head from 'next/head';

import { About } from '../components/about';
import { Header } from '../components/header';

const Index: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Timothy Cole - Software Engineer</title>
      </Head>
      <About />
      <Header />
      <Setup>
        <img src="/IMG_2173.jpeg" />
      </Setup>
      <Setup>
        <img src="/neofetch.png" />
      </Setup>
    </div>
  );
};

export default Index;

const Setup = styled.div`
  margin: 50px;

  img {
    max-height: 200px;
  }
`;
