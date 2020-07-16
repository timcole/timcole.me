/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.svg' {
  const value: React.StatelessComponent<React.SVGAttributes<SVGElement>>;
  export default value;
}

declare module 'react-apple-emojis' {
  import * as React from 'react';

  export interface EmojiProps {
    name: string;
    onClick?: () => void;
    style?: CSSProperties;
  }

  export default class Emoji extends React.Component<EmojiProps, any> {}
}
