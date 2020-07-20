import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import Emoji from 'react-apple-emojis';

import { rainDown } from '../lib/rain';

export const About: FunctionComponent = () => {
  const [showNotice, setNotice] = useState(false);

  return (
    <AboutBanner>
      <Background />
      {showNotice && (
        <RainNotice>
          <h4>
            You found an <Emoji name="egg" />!
          </h4>
          <p>
            <b>Behind the egg:</b> I originally created this on Social Blade for
            when Loserfruit hit 1.5m subs on YouTube
          </p>
          <a
            href="https://clips.twitch.tv/RealFurtiveCarrotYouDontSay"
            target="_blank"
          >
            Watch the clip
          </a>
        </RainNotice>
      )}
      <Topper>
        <Left>
          <h2>Timothy Cole</h2>
          <p>
            My name is Timothy Cole <Emoji name="unicorn" />. I'm a 23 year old,
            self-taught, software engineer. American{' '}
            <Emoji name="flag-united-states" /> but currently living in
            Vancouver, BC. <Emoji name="flag-canada" />
          </p>
          <p>
            <span>
              Full-time Sr Software Engineer at Notify Technology, Inc.{' '}
              <Emoji name="bell" />
            </span>
            <span>
              Free-time Developer at Social Blade LLC{' '}
              <Emoji name="chart-increasing" />
            </span>
            <span>
              Volunteer Admin for the TwitchDev Community{' '}
              <Emoji
                onClick={() => {
                  setNotice(true);
                  rainDown(() => setNotice(false));
                }}
                style={{ cursor: 'help' }}
                name="purple-heart"
              />
            </span>
          </p>
        </Left>
        <img className="me" src="https://cdn.t.pics/nyc-tim.jpg" />
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
  background: var(--background_200);
  padding: 20px 25px;
  max-width: 460px;
  box-shadow: 0 4px 4px 0 var(--background_100);

  h4 {
    font-size: 1.4em;
    color: var(--accent);
    margin: 0;
  }

  a {
    display: block;
    text-decoration: none;
    color: var(--background);
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

  img.me {
    height: calc(525px - 150px);
    box-shadow: 0 4px 4px 0 rgba(37, 40, 48, 0.5);
    margin-right: 25px;

    @media (max-width: 1035px) {
      display: none;
    }
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

    span {
      font-size: 0.8em;
      display: block;
    }
  }

  @media (max-width: 1035px) {
    margin 0 25px;
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
  }
`;
