import { FunctionComponent } from 'react';
import styled from 'styled-components';
import Head from 'next/head';

export const Layout: FunctionComponent = ({ children }) => {
  return (
    <Body>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦄</text></svg>"
        />
        <meta
          name="keywords"
          content="Software Engineer, Full Stack Developer, Web Developer, Programmer"
        />
        <meta name="description" content="Timothy Cole - Software Engineer" />
        <meta name="author" content="Timothy Cole" />
        <meta name="copyright" content="Timothy Cole" />
        <meta name="rating" content="General" />
        <meta name="url" content="https://timcole.me" />
        <meta name="twitter:creator" content="@ModestTim" />
        <meta name="twitter:site" content="@ModestTim" />
        <link rel="dns-prefetch" href="https://cdn.tcole.me/" />
        <link rel="preload" href="https://cdn.t.pics/logo.png" as="image" />
      </Head>
      <Content>
        {children}
        <Footer>
          Copyright &copy; 1997-{new Date().getFullYear()} - Timothy Cole - All
          Rights Reserved. —{' '}
          <a href="https://github.com/timcole/timcole.me" target="_blank">
            Star on GitHub
          </a>
        </Footer>
      </Content>
    </Body>
  );
};

const Body = styled.div`
  display: flex;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.color};
  height: 100%;
  width: 100%;
  overflow: hidden;
  flex-direction: column;
`;

const Content = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Footer = styled.div`
  padding: 25px 0;
  text-align: center;
  opacity: 0.8;

  a {
    text-decoration: none;
    color: var(--text);
    font-style: italic;
    padding-bottom: 5px;
    border-bottom: 1px solid var(--accent);

    &:hover {
      opacity: 1;
    }
  }
`;
