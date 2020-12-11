import React from 'react';
import Image from 'next/image';

interface Props {
  name: string;
  hex: string | Array<string>;
  size?: number;
  onClick?: () => void;
}

const Emoji: React.FC<Props> = ({ name, hex, size = 22, ...props }) => {
  if (!hex) console.warn(`Emoji: missing hex for ${name}`);
  hex = typeof hex == 'object' ? hex.join('-') : hex;

  return (
    <Image
      src={`https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/${name}_${hex}.png`}
      alt={name}
      aria-label={name}
      width={size}
      height={size}
      {...props}
    />
  );
};

export default Emoji;
