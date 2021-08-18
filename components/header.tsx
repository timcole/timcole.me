import { FunctionComponent } from 'react';
import styled from 'styled-components';

import GitHub from '../public/brands/github.svg';
import LinkedIn from '../public/brands/linkedin.svg';
import Twitter from '../public/brands/twitter.svg';
import YouTube from '../public/brands/youtube.svg';
import Instagram from '../public/brands/instagram.svg';
import Twitch from '../public/brands/twitch.svg';

export const Header: FunctionComponent = () => {
  return (
    <Socials>
      <a href="https://github.com/timcole" target="_blank">
        <GitHub data-icon="github" />
      </a>
      <a href="https://www.linkedin.com/in/modesttim" target="_blank">
        <LinkedIn data-icon="linkedin" />
      </a>
      <a href="https://twitter.com/modesttim" target="_blank">
        <Twitter data-icon="twitter" />
      </a>
      <a href="https://t.pics" target="_blank">
        <Instagram data-icon="instagram" />
      </a>
      <a href="https://www.youtube.com/user/EatTim?sub_confirmation=1" target="_blank">
        <YouTube data-icon="youtube" />
      </a>
      <a href="https://www.twitch.tv/modesttim" target="_blank">
        <Twitch data-icon="twitch" />
      </a>
    </Socials>
  );
};

const Socials = styled.p`
  display: flex;
  align-items: center;
  flex-direction: row;

  a {
    display: block;
    margin: 0 12px 0 0;
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
        &[data-icon='linkedin'] {
          color: #0a66c2;
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
      }
    }
  }
`;
