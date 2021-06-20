import { GetServerSideProps, NextPage } from 'next';
import styled from 'styled-components';
import Head from 'next/head';
import Image from 'next/image';

import { About } from '../components/about';
import { Header } from '../components/header';
import Launch, { Props as LaunchProps } from '../components/launch';
import { useLanyard } from '../components/lanyard';

type Props = {
  nextLaunch?: LaunchProps;
};

const VIM = '439476230543245312';

const Index: NextPage<Props> = ({ nextLaunch }) => {
  const { activities } = useLanyard();
  const vim = activities?.find(({ application_id }) => application_id === VIM) || null;

  return (
    <div>
      <Head>
        <title>Timothy Cole - Software Engineer</title>
      </Head>
      <About />
      <Header />
      <Setup>
        <Container>
          <ContainerImage>
            <Image src="https://cdn.t.pics/setup.png" height={200} width={355.55} />
          </ContainerImage>
          <div className="desc">
            <h2>Desk Setup</h2>
            <p>
              My desk is made from a normal butcher block countertop ontop of the{' '}
              <a
                href="https://www.autonomous.ai/standing-desks/diy-smart-desk-kit?option16=36&option17=41&rid=1ec031&utm_campaign=referrals&utm_source=referrals_copy&utm_medium=1ec031&utm_term=referrals_share"
                target="_blank"
              >
                Autonomous SmartDesk DIY Kit (Premium - White).
              </a>
            </p>
            <p>
              I also sit in the{' '}
              <a
                href="https://www.autonomous.ai/office-chairs/kinn-chair&rid=1ec031&utm_campaign=referrals&utm_source=referrals_copy&utm_medium=1ec031&utm_term=referrals_share"
                target="_blank"
              >
                Autonomous Kinn Chair
              </a>
            </p>
            <p>
              Find the tech on my{' '}
              <a
                href="https://www.amazon.com/ideas/amzn1.account.AGCTFSXJPHS6PNR5DH573SDR2GLA/1Q0UPDVESE0UE"
                target="_blank"
              >
                Amazon Page.
              </a>
            </p>
          </div>
        </Container>
      </Setup>
      {nextLaunch ? <Launch {...nextLaunch} /> : ''}
      <Setup style={{ background: 'var(--background_200)' }}>
        <Container>
          <ContainerImage>
            <Image src="https://cdn.t.pics/dotfiles/floating-screenshot.jpg" height={200} width={355.55} />
          </ContainerImage>
          <div className="desc">
            <h2>Programming Setup</h2>
            <p>I’m a Vim user, or more specifically, NeoVim.</p>
            <p>
              I’ve been using Vim as my main editor for the last{' '}
              {new Date().getUTCFullYear() - new Date('Feb 3, 2019, 1:44 PM EST').getUTCFullYear()} years!
            </p>
            <p>
              Checkout my{' '}
              <a href="https://github.com/timcole/dotfiles" target="_blank">
                dotfiles
              </a>{' '}
              if you’re interested in my config.
            </p>
            {vim ? (
              <p>
                I'm currently editing{' '}
                <span>
                  <Image
                    width="18"
                    height="18"
                    src={`https://cdn.discordapp.com/app-assets/${VIM}/${vim.assets.large_image}`}
                  />{' '}
                  {vim.details.split(': ')[1]}
                </span>{' '}
                in a directory called <span>{vim.state}</span>
              </p>
            ) : (
              ''
            )}
          </div>
        </Container>
      </Setup>
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

const Setup = styled.div`
  padding: 50px;

  img {
    max-height: 200px;
  }
`;

const ContainerImage = styled.div`
  width: 100%;
  margin-right: 75px;
  flex: 1;

  height: 100%;
  vertical-align: middle;

  @media (max-width: 900px) {
    height: auto;
    margin: 0;
    text-align: center;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 1275px;
  display: flex;

  div.desc {
    padding-right: 50px;
    flex: 2;

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

    span {
      background: var(--background);
      font-style: italic;
      padding: 4px 8px;
      border-radius: 4px;

      div,
      img {
        vertical-align: top;
      }
    }
  }

  @media (max-width: 900px) {
    display: block;
    text-align: center;

    div.desc {
      padding: 0;

      h2 {
        display: inline-block;
      }
    }
  }
`;
