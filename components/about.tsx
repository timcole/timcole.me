import { FunctionComponent } from 'react';
import styled from 'styled-components';

export const About: FunctionComponent = () => {
  return (
    <AboutBanner>
      <Background />
      <Topper>
        <Left>
          <h2>Timothy Cole</h2>
          <p>
            My name is Timothy Cole 🦄. I'm a 23 year old, self-taught, software
            engineer. American 🇺🇸 but currently living in Vancouver, BC. 🇨🇦
          </p>
          <p>
            <span>
              Full-time Sr Software Engineer at Notify Technology, Inc. 🔔
            </span>
            <span>Free-time Developer at Social Blade LLC 📈 </span>
            <span>Volunteer Admin for the TwitchDev Community 💜</span>
          </p>
        </Left>
        <img src="/IMG_0063.jpg" />
      </Topper>
    </AboutBanner>
  );
};

const AboutBanner = styled.div`
  position: relative;
  height: 525px;

  @media (max-width: 650px) {
    height: 350px;
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

  img {
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
  background-image: url('/IMG_0022.JPG');
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
