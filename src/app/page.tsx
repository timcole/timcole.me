import Link from 'next/link';

import Lanyard from '@/components/Lanyard';
import AboutMe from '@/components/about';
import Positions from '@/components/positions';
import { albums, base_url } from '@/utils/images';
import { Image } from '@/components/image';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col px-3">
      <AboutMe />
      <Lanyard />
      <Positions />

      <div className="flex flex-col gap-2 py-4">
        <h2 className="font-semibold text-primary-50">Amateur Photography</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8 gap-4 justify-center">
          {albums.map(({ slug, name, photos, description }) => (
            <Link key={slug} href={{ pathname: `/${slug}` }} prefetch={true}>
              <div
                key={`album-${slug}`}
                className="border border-primary-700 divide-y divide-primary-700 hover:border-cyan-500 hover:divide-cyan-500 hover:bg-cyan-900"
              >
                <div className="relative aspect-square">
                  <Image
                    src={`${base_url}/${slug}/${photos.at(0)?.file}`}
                    fill
                    alt={description}
                    sizes="200px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <p className="px-3 py-2 text-sm">{name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
