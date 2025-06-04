import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Instagram, ChevronLeft, X } from 'lucide-react';

import { base_url, getPhotoByFilename } from '@/utils/images';
import ShareButton from '@/components/share';
import { Metadata } from 'next';
import ExifData from '@/components/exif';

type Props = { params: Promise<{ album: string; file: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { album, file } = await params;
  const photo = getPhotoByFilename(album, file);
  if (!photo) throw 'not found';

  return {
    title: `Photo "${photo.file}" - Timothy Cole`,
    description: `Photo "${photo.file}" from "${photo.album.name}"`,
    openGraph: {
      images: [{ url: `${base_url}/${photo.album.slug}/${photo.file}` }],
    },
  };
}

export default async function Photo({ params }: Props) {
  const { album, file } = await params;
  const photo = getPhotoByFilename(album, file);
  if (!album) return notFound();

  return (
    <div className="flex-1 overflow-auto flex flex-col lg:flex-row h-full justify-between divide-y divide-x-0 lg:divide-x lg:divide-y-0 divide-cyan-900">
      <div className="w-full flex-1 justify-center align-middle flex relative">
        <Link
          href={`/${album}`}
          className="absolute z-20 opacity-0 hover:opacity-100 transition-opacity left-2 top-2 bg-primary-900 p-2 rounded-full text-primary-50"
        >
          <X />
        </Link>
        {photo?.prevFile && (
          <Link
            href={`/${album}/${photo.prevFile}`}
            className="absolute z-20 opacity-60 hover:opacity-100 transition-opacity left-2 top-1/2 -translate-y-1/2 bg-primary-900 p-2 rounded-full text-primary-50"
            prefetch={true}
          >
            <ChevronLeft />
          </Link>
        )}
        {photo?.nextFile && (
          <Link
            href={`/${album}/${photo.nextFile}`}
            className="absolute z-20 opacity-60 hover:opacity-100 transition-opacity right-2 top-1/2 -translate-y-1/2 bg-primary-900 p-2 rounded-full text-primary-50"
            prefetch={true}
          >
            <ChevronLeft className="rotate-180" />
          </Link>
        )}
        <div key={`img-${album}-${file}`} className="relative h-full w-full">
          <img
            src={`${base_url}/${album}/${file}`}
            alt={file}
            className="w-full h-full object-contain relative z-10 shadow-md"
          />
          <img
            src={`${base_url}/${album}/${file}`}
            alt={file}
            className="w-full h-full absolute top-0 object-cover blur-lg opacity-20"
          />
        </div>
      </div>
      <div className="bg-primary-800 w-full lg:w-md h-full min-h-fit p-4 flex flex-col gap-8 z-10">
        <div className="flex justify-between">
          <h1>{file}</h1>
          <Link href={`/${album}`} className="text-primary-50">
            <X />
          </Link>
        </div>
        <Suspense fallback={<p>Loading EXIF Data</p>}>
          <ExifData url={`${base_url}/${album}/${file}`} />
        </Suspense>

        <div className="pt-4 border-t border-cyan-500/30">
          <div className="flex items-center gap-4">
            <ShareButton />
            {photo?.album.instagram && (
              <a
                href={photo.album.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-cyan-500 font-mono text-sm hover:underline"
              >
                <Instagram className="h-4 w-4" />
                View on Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
