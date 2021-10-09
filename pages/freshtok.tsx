import { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import Article from '../components/article';
import Link from 'next/link';

const FreshTokPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>FreshTok - Discord TikTok Notification Bot</title>
      </Head>
      <Header>
        <Brand>
          <Link href="/">
            <a>
              <img src="https://cdn.t.pics/freshtok-big.png" title="tim" />
              <span>FreshTok</span>
            </a>
          </Link>
        </Brand>
      </Header>
      <Article image="https://cdn.t.pics/freshtok-post.png">
        <h2>New TikTok Notifications</h2>
        <p>Don't let your community miss another TikTok again.</p>
        <p>
          FreshTok allows you to set up automatic notifications to let your
          Discord community know when you've posted a fresh, new TikTok.
        </p>
        <p>
          <Button href="https://discord.com/oauth2/authorize?client_id=890842672133201950&permissions=19456&scope=bot%20applications.commands&response_type=token">
            <button>Invite Bot</button>
          </Button>
          <Button href="https://discord.gg/aAkysWTk" target="_blank">
            <button className="support">Support Server</button>
          </Button>
        </p>
      </Article>
      <Article image="https://cdn.t.pics/jX6u0JKfVvI.png" darker>
        <h2>Commands</h2>
        <p>
          <span>/channel [channel:optional]</span> - Get or the set the default
          channel used for notifications.
        </p>
        <p>
          <span>/permission [role:optional]</span> - Get or the set the role
          used by notification managers.
        </p>
        <p>
          <span>/membership</span> - <b>Server Owner Only</b> manage the
          server's membership.
        </p>
        <p>
          <span>/subscriptions</span> - Get a list of TikTokers the server is
          currently subscribed too.
        </p>
        <p>
          <span>/subscribe [creator] [channel:optional]</span> - Subscribe to a
          TikToker to get notified when they post. Specify a channel if you
          don't want it in your set default channel.
        </p>
        <p>
          <span>/unsubscribe [creator]</span> - Unsubscribe from a TikTokers
          posts.
        </p>
      </Article>
      <Article image="https://cdn.t.pics/memberships.gif">
        <h2>Memberships</h2>
        <p>
          Guilds with less than 1k members get a single <b>free</b>{' '}
          subscription, guilds with more get one extra that can be used for your
          alt account.
        </p>
        <p>
          Additional slots can be unlocked for $1 /slot up to 10 total slots
          (including your free slot(s)) then you get unlimited.
        </p>
        <p>
          For the most part, I believe that everyone using it for their own
          TikTok's should be free but, if you do need more slots, you can
          upgrade for more by having the server owner using the{' '}
          <span>/membership</span> command.
        </p>
        <p>
          Payments are handled by <a>Stripe</a> and are managed by the server
          owner in discord. If you need to upgrade/downgrade/chancel your
          membership you can do so at any time by using the{' '}
          <span>/membership</span> command again.
        </p>
      </Article>
      <Disclaimer>
        Public data is sourced from TikTok, but the presentation is not
        controlled by them. Use of the name TikTok is for context, not claiming
        any ownership.
      </Disclaimer>
    </div>
  );
};

export default FreshTokPage;

const Header = styled.div`
  display: flex;
  background: var(--background_200);
  border-bottom: 1px solid var(--accent);
`;

const Brand = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  padding: 8px 25px;
  flex: 1;
  align-items: center;

  a {
    text-decoration: none;
    color: var(--text);
  }

  h3 {
    display: flex;
  }

  img {
    vertical-align: middle;
    height: 25px;
    padding-bottom: 5px;
    padding-right: 15px;
  }
`;

const Nav = styled.div`
  margin: 11px 15px;
`;

const Button = styled.a`
  text-decoration: none;
  margin-right: 15px;

  button {
    padding: 10px 25px;
    background: transparent;
    border-radius: 6px;
    border: 0;
    cursor: pointer;
    background: var(--accent);
    color: var(--text);

    &.support {
      background: #5865f2;
    }

    &:hover {
      opacity: 0.8;
    }
  }
`;

const Disclaimer = styled.p`
  margin: 0;
  padding: 10px;
  text-decoration: italic;
  text-align: center;
  background: var(--background_100);
`;
