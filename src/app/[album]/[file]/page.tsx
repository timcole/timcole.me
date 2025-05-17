import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Suspense,
  use,
  unstable_ViewTransition as ViewTransition,
} from 'react';
import exifr from 'exifr';
import {
  Instagram,
  Camera,
  Clock,
  Aperture,
  ChevronLeft,
  X,
} from 'lucide-react';

import { base_url, getPhotoByFilename } from '@/utils/images';
import ShareButton from '@/components/share';
import { Metadata, ResolvingMetadata } from 'next';

type Props = { params: Promise<{ album: string; file: string }> };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
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

export default async function Album({ params }: Props) {
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

const formatNumber = (num: number) =>
  Number.isInteger(num)
    ? num.toString()
    : parseFloat(num.toFixed(3)).toString();

function ExifData({ url }: { url: string }) {
  const exif = use(exifr.parse(url));

  return (
    <div>
      <div className="space-y-4 text-sm">
        <h4 className="text-cyan-500 font-mono text-sm">EXIF Data</h4>

        <div className="flex items-start gap-2">
          <Camera className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-gray-300">
              {exif.Make} {exif.Model.replace(exif.Make, '')}
            </p>
            {exif.LensModel && (
              <p className="text-gray-400">{exif.LensModel}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-gray-300">
              {(exif.CreateDate as Date).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Aperture className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
          <div className="flex flex-wrap gap-y-2 w-full">
            {exif.FNumber && (
              <div className="w-32">
                <p className="text-gray-400">Aperture</p>
                <p className="text-gray-300">ƒ/{exif.FNumber.toFixed(1)}</p>
              </div>
            )}

            {exif.ExposureTime && (
              <div className="w-32">
                <p className="text-gray-400">Shutter</p>
                <p className="text-gray-300">
                  1/{Math.round(1 / exif.ExposureTime)}
                </p>
              </div>
            )}

            {exif.ISO && (
              <div className="w-32">
                <p className="text-gray-400">ISO</p>
                <p className="text-gray-300">{exif.ISO}</p>
              </div>
            )}

            {exif.FocalLength && (
              <div>
                <p className="text-gray-400">Focal Length</p>
                <p className="text-gray-300">
                  {formatNumber(exif.FocalLength)}mm{' '}
                  {exif.FocalLengthIn35mmFormat && (
                    <span className="text-sm block">
                      {exif.FocalLengthIn35mmFormat}mm (full frame equivalent)
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
