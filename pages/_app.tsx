import { AppProps } from 'next/app';
import React, { FunctionComponent } from 'react';
import { createGlobalStyle } from 'styled-components';

import { Layout } from '../components/layout';

import '../public/dank-mono.css';

const GlobalStyle = createGlobalStyle`
  :root {
    --background: #252830;
    --background_100: #292D39;
    --background_200: #21232B;
    --text: #fff;
    --accent: #1C94EB
  }

  html, body {
    font-family: 'dm';
    padding: 0;
    margin: 0;
    background: var(--background);
    color: var(--text);
  }
`;

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <GlobalStyle />
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
