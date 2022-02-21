import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import Emoji from '../components/emoji';

import { rainDown } from '../lib/rain';
import Status from './status';
import { Header } from './header';

export const About: FunctionComponent = () => {
  const [showNotice, setNotice] = useState(false);

  return (
    <AboutBanner>
      <Background />
      {showNotice && (
        <RainNotice>
          <h4>
            You found an <Emoji name="egg" hex="1f95a" />!
          </h4>
          <p>
            <b>Behind the egg:</b> I originally created this on Social Blade for
            when Loserfruit hit 1.5m subs on YouTube
          </p>
        </RainNotice>
      )}
      <Topper>
        <Left>
          <h2>Timothy Cole</h2>
          <p>
            My name is Timothy Cole <Emoji name="unicorn-face" hex="1f984" />.
            I'm a 24 year old, self-taught, software engineer. American{' '}
            <Emoji name="flag-for-united-states" hex={['1f1fa', '1f1f8']} />{' '}
            located in Raleigh, North Carolina.
          </p>
          <p>
            <span>
              Full-time Software Engineer at Social Blade LLC{' '}
              <Emoji name="chart-with-upwards-trend" hex="1f4c8" size={18} />
            </span>
          </p>
          <p>
            <span>
              Volunteer Admin for the TwitchDev Community{' '}
              <Emoji
                onClick={() => {
                  setNotice(true);
                  rainDown(() => setNotice(false));
                }}
                name="purple-heart"
                hex="1f49c"
                size={18}
              />
            </span>
          </p>
          <Header />
        </Left>
        <Me>
          <Image
            src="https://cdn.t.pics/nyc-tim.jpg"
            height={375}
            width={281.25}
          />
          <Status />
        </Me>
      </Topper>
    </AboutBanner>
  );
};

const AboutBanner = styled.div`
  position: relative;
  height: 525px;

  @media (max-width: 650px) {
    height: 450px;
  }
`;

const RainNotice = styled.div`
  position: fixed;
  z-index: 69;
  top: 25px;
  left: 25px;
  background: var(--background_300);
  padding: 20px 25px;
  max-width: 460px;
  box-shadow: 0 4px 4px 0 var(--background_200);

  h4 {
    font-size: 1.4em;
    color: var(--accent);
    margin: 0;
  }

  a {
    display: block;
    text-decoration: none;
    color: var(--background_100);
    background: var(--accent);
    padding: 10px 0;
    text-align: center;

    &:hover {
      opacity: 0.9;
    }
  }
`;

const Topper = styled.div`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 100%;
  max-width: 1275px;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

const Me = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 4px 0 rgba(37, 40, 48, 0.5);
  margin-right: 25px;
  position: relative;

  @media (max-width: 1035px) {
    display: none;
  }
`;

const Left = styled.div`
  margin-left: 25px;
  margin-right: 150px;
  flex: 1;

  h2 {
    font-size: 72px;
    color: #1c94eb;
    letter-spacing: 0;
    text-transform: lowercase;
    text-shadow: 0 2px 1px rgba(37, 40, 48, 0.55);
    margin: 0;
    margin-bottom: 50px;

    @media (max-width: 650px) {
      font-size: 32px;
      margin-bottom: 25px;
    }
  }

  p {
    font-size: 1.3em;

    div {
      vertical-align: middle;
    }

    span {
      font-size: 0.8em;
      display: block;
    }
  }

  @media (max-width: 1035px) {
    margin: 0 25px;
  }
`;

const Background = styled.div`
  background-image: url('https://cdn.t.pics/nyc.jpg');
  background-repeat: no-repeat;
  background-position: center 25%;
  background-size: 100%;
  height: 525px;
  width: 100%;
  opacity: 0.2;
  filter: blur(10px);

  @media (max-width: 650px) {
    height: 350px;
`;
