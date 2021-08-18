import Image from 'next/image';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

const Stream = dynamic(() => import('./hls'), {
  ssr: false,
});

type Props = {
  darker?: boolean;
  image: string;
  stream?: string;
  children: ReactNode;
};

const Article: FC<Props> = ({ stream, image, children, darker }) => {
  return (
    <Div darker={darker}>
      <Container>
        <ContainerImage>
          {!stream || !stream.endsWith('m3u8') ? (
            <Image src={image} height={200} width={355.55} />
          ) : (
            <Stream stream={stream} image={image} />
          )}
        </ContainerImage>
        <div className="desc">{children}</div>
      </Container>
    </Div>
  );
};

export default Article;

const Div = styled.div<{ darker: boolean }>`
  padding: 50px;
  background: var(
    ${({ darker }) => (darker ? '--background_100' : '--background_300')}
  );

  img,
  video {
    max-height: 200px;
  }
`;

const ContainerImage = styled.div`
  width: 100%;
  margin-right: 75px;
  flex: 1;
  position: relative;

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
      background: var(--background_200);
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
