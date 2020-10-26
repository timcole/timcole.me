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
        <Container>
          <img src="https://cdn.t.pics/setup.jpg" />
          <div>
            <h2>Desk Setup</h2>
            <p>
              <i>TBD</i>: I moved back to America recently after living in
              Vancouver, BC for a year.
            </p>
            <p>Setup is incomplete at this time.</p>
            <p>
              Find the tech on my{' '}
              <a href="https://amazon.com/shop/modesttim" target="_blank">
                Amazon Page <sup>ad</sup>
              </a>
            </p>
          </div>
        </Container>
      </Setup>
      <Setup style={{ background: 'var(--background_200)' }}>
        <Container>
          <img src="https://cdn.t.pics/dotfiles/floating-screenshot.jpg" />
          <div>
            <h2>Programming Setup</h2>
            <p>I’m a Vim user, or more specifically, NeoVim.</p>
            <p>
              I’ve been using Vim as my main editor for the last 2 years and
              have been loving every second of it!
            </p>
            <p>
              Checkout my{' '}
              <a href="https://github.com/TimothyCole/dotfiles" target="_blank">
                dotfiles
              </a>{' '}
              if you’re interested in my config.
            </p>
          </div>
        </Container>
      </Setup>
    </div>
  );
};

export default Index;

const Setup = styled.div`
  padding: 50px;

  img {
    max-height: 200px;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 1275px;
  display: flex;

  img {
    margin-right: 75px;
    height: 200px;
    width: auto;
  }

  div {
    padding-right: 50px;

    h2 {
      border-left: 2px solid var(--accent);
      padding-left: 10px;
      font-style: italic;
    }

    a {
      color: var(--text);
      text-decoration: none;
      font-style: italic;
    }
  }

  @media (max-width: 900px) {
    display: block;
    text-align: center;

    img {
      height: auto;
      margin: 0;
    }

    div {
      padding: 0;

      h2 {
        display: inline-block;
      }
    }
  }
`;
