import { AppProps } from 'next/app';
import React, { FunctionComponent } from 'react';
import { createGlobalStyle } from 'styled-components';

import { Layout } from '../components/layout';
import LanyardProvider from '../components/lanyard';

import '../public/dank-mono.css';

const GlobalStyle = createGlobalStyle`
  :root {
    --background: #161D25;
    --background_100: #0F1219; // Header
    --background_200: #1D2631;
    --text: #fff;
    --accent: #1C94EB
  }

  html, body {
    font-family: 'Operator Mono', 'dm', monospace;
    padding: 0;
    margin: 0;
    background: var(--background);
    color: var(--text);
  }

  img[src^='https://emojipedia-us'] {
    height: 1.25em;
    vertical-align: middle;
    padding: 0;
    margin: 0;
  }
`;

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <LanyardProvider>
        <GlobalStyle />
        <Component {...pageProps} />
      </LanyardProvider>
    </Layout>
  );
};

export default App;
