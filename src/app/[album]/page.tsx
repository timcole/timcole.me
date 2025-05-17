import { base_url, getAlbumBySlug } from '@/utils/images';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { unstable_ViewTransition as ViewTransition } from 'react';
import exifr from 'exifr';
import { Metadata, ResolvingMetadata } from 'next';
import ReactDOM from 'react-dom';
import { Instagram } from 'lucide-react';

import ShareButton from '@/components/share';
import { Image } from '@/components/image';

type Props = { params: Promise<{ album: string }> };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const album = getAlbumBySlug((await params).album);
  if (!album) throw 'not found';

  return {
    title: `Photos from "${album.name}" - Timothy Cole`,
    description: album.description,
    openGraph: {
      images: [
        { url: `${base_url}/${album.slug}/${album.photos.at(0)?.file}` },
      ],
    },
  };
}

export default async function Album({ params }: Props) {
  const album = getAlbumBySlug((await params).album);
  if (!album) return notFound();

  return (
    <div className="flex-1 flex flex-col p-3 container mx-auto gap-4">
      <div className="flex justify-between">
        <Link href="/">
          <p>Go home</p>
        </Link>
        <div className="flex items-center gap-4">
          {album.instagram && (
            <a
              href={album.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-cyan-500 font-mono text-sm hover:underline"
            >
              <Instagram className="h-4 w-4" />
              View on Instagram
            </a>
          )}
          <ShareButton />
        </div>
      </div>
      <ViewTransition name={`album-${album.slug}`}>
        <h1 className="text-xl text-cyan-500">{album.name}</h1>
      </ViewTransition>
      <p className="whitespace-break-spaces">{album.description}</p>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-center">
        {album.photos.map(async ({ file }) => (
          <Link
            key={`img-${album.slug}-${file}`}
            href={{ pathname: `/${album.slug}/${file}` }}
            prefetch={true}
          >
            <div className="border border-primary-700 divide-y divide-primary-700 hover:border-cyan-500 hover:divide-cyan-500 hover:bg-cyan-900">
              <ViewTransition name={`photo-${file}`}>
                <div className="relative aspect-square">
                  <Image
                    src={`${base_url}/${album.slug}/${file}`}
                    fill
                    alt={file}
                    sizes="200px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </ViewTransition>
              <ViewTransition name={`photo-name-${file}`}>
                <p className="px-3 py-2 text-sm">{file}</p>
              </ViewTransition>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
