import { FunctionComponent } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

export const Header: FunctionComponent = () => {
  return (
    <>
      <Head>
        <Container>
          <Brand className="image">
            <Link href="/">
              <a>
                <img src="https://cdn.tcole.me/logo.png" title="tim" />
              </a>
            </Link>
          </Brand>
          <Socials></Socials>
        </Container>
      </Head>
      <Nav>
        <a href="/">/uses 👨🏼‍💻</a>
        <a data-disabled title="Coming Soon™️">
          Articles 📝
        </a>
        <a href="mailto:website@timcole.me">Contact 📨</a>
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

  a img {
    vertical-align: middle;
    height: 35px;
  }
`;

const Socials = styled.div`
  margin: 11px 15px;
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

    &:not([data-disabled]):hover {
      border-color: var(--accent);
    }

    &[data-disabled] {
      cursor: not-allowed;
    }
  }
`;
