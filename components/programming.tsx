import Image from 'next/image';
import { FC } from 'react';
import Article from './article';
import { useLanyard } from './lanyard';

const VIM = '439476230543245312';

const Programming: FC = () => {
  const { activities } = useLanyard();
  const vim =
    activities?.find(({ application_id }) => application_id === VIM) || null;

  return (
    <Article image="https://cdn.t.pics/dotfiles/floating-screenshot.jpg">
      <h2>Programming Setup</h2>
      <p>I’m a Vim user, or more specifically, NeoVim.</p>
      <p>
        I’ve been using Vim as my main editor for the last{' '}
        {new Date().getUTCFullYear() -
          new Date('Feb 3, 2019, 1:44 PM EST').getUTCFullYear()}{' '}
        years!
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
            {vim.details.split(': ')[1] || 'an unsaved file'}
          </span>{' '}
          in a directory called <span>{vim.state}</span>
        </p>
      ) : (
        ''
      )}
    </Article>
  );
};

export default Programming;
