import { FunctionComponent } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Emoji from '../components/emoji';

import GitHub from '../public/brands/github.svg';
import Twitter from '../public/brands/twitter.svg';
import YouTube from '../public/brands/youtube.svg';
import Instagram from '../public/brands/instagram.svg';
import Twitch from '../public/brands/twitch.svg';

export const Header: FunctionComponent = () => {
  return (
    <>
      <Head>
        <Container>
          <Brand className="image">
            <Link href="/">
              <a>
                {/* <img src="https://cdn.t.pics/logo.png" title="tim" /> */}
                <Emoji name="unicorn-face" hex="1f984" size={35} />
              </a>
            </Link>
          </Brand>
          <Socials>
            <a href="https://github.com/timcole" target="_blank">
              <GitHub />
            </a>
            <a href="https://twitter.com/modesttim" target="_blank">
              <Twitter />
            </a>
            <a href="https://t.pics" target="_blank">
              <Instagram />
            </a>
            <a href="https://www.youtube.com/user/EatTim?sub_confirmation=1" target="_blank">
              <YouTube />
            </a>
            <a href="https://www.twitch.tv/modesttim" target="_blank">
              <Twitch />
            </a>
          </Socials>
        </Container>
      </Head>
      <Nav>
        <Link href="/" as="/">
          <a className="active">
            /uses <Emoji name="male-technologist" hex={['1f468', '200d', '1f4bb']} size={20} />
          </a>
        </Link>
        <a data-disabled title="Coming Soon" style={{ opacity: 0.5 }}>
          Articles <Emoji name="memo" hex="1f4dd" size={20} />
        </a>
        <a href="mailto:website@timcole.me">
          Contact <Emoji name="incoming-envelope" hex="1f4e8" size={20} />
        </a>
      </Nav>
    </>
  );
};

const Head = styled.div`
  background: var(--background_100);
  z-index: 1;
  position: relative;
`;

const Container = styled.div`
  display: flex;
  max-width: 1275px;
  margin: 0 auto;
  height: 55px;
  padding: 0 25px;
`;

const Brand = styled.h3`
  margin: 0;
  flex: 1;
  line-height: 50px;

  a div {
    vertical-align: middle;
  }
`;

const Socials = styled.div`
  margin: 0 15px;
  display: flex;
  align-items: center;

  a {
    display: block;
    margin: 0 5px 0 12px;
    padding: 5px;

    svg {
      height: 25px;
      color: var(--text);
      opacity: 0.85;
      transition: ease all 150ms;

      &:hover {
        opacity: 1;

        &[data-icon='twitter'] {
          color: #1da1f2;
        }
        &[data-icon='instagram'] {
          color: #e1306c;
        }
        &[data-icon='youtube'] {
          color: #ff0000;
        }
        &[data-icon='twitch'] {
          color: #9146ff;
        }
        &[data-icon='notify'] {
          color: #3b60ff;
        }
      }
    }
  }
`;

const Nav = styled.div`
  display: flex;
  background: var(--background_200);
  justify-content: center;

  a {
    display: block;
    padding: 10px;
    margin: 0 30px;
    font-size: 1em;
    text-decoration: none;
    color: var(--text);
    border-bottom: 1px solid transparent;
    outline: none;

    div {
      vertical-align: middle;
    }

    &:not([data-disabled]):hover {
      border-color: var(--accent);
    }

    &[data-disabled] {
      cursor: not-allowed;
    }

    &.active {
      border-color: var(--accent);
    }

    @media (max-width: 550px) {
      img {
        display: none;
      }
    }
  }
`;
