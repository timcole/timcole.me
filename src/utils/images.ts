export const base_url = 'https://t.pics/photography';

export const albums = [
  {
    slug: 'cocoa-airshow-2025',
    name: 'Cocoa Beach Airshow 2025',
    description: 'Cocoa Beach Air Show',
    instagram: 'https://www.instagram.com/p/DMG9qcTg9SS/',
    photos: [
      { file: 'DSC01608.jpg' },
      { file: 'DSC01421.jpg' },
      { file: 'DSC00612.jpg' },
      { file: 'DSC01070.jpg' },
      { file: 'DSC07103.jpg' },
      { file: 'DSC08541.jpg' },
      { file: 'DSC00768.jpg' },
      { file: 'DSC06967.jpg' },
      { file: 'DSC07861.jpg' },
      { file: 'DSC09099.jpg' },
    ],
  },
  {
    slug: 'brevard-zoo',
    name: 'Brevard Zoo',
    description: 'Went to the brevard zoo to test out my new a6700 camera body',
    instagram: 'https://www.instagram.com/p/DJhxSnzySOk/',
    photos: [
      { file: 'DSC00386.jpeg' },
      { file: 'DSC00376.jpeg' },
      { file: 'DSC00418.jpeg' },
      { file: 'DSC00429.jpeg' },
      { file: 'DSC00433.jpeg' },
      { file: 'DSC00451.jpeg' },
      { file: 'DSC00465.jpeg' },
      { file: 'DSC00467.jpeg' },
      { file: 'DSC00468.jpeg' },
      { file: 'DSC00480.jpeg' },
      { file: 'DSC00493.jpeg' },
    ],
  },
  {
    slug: 'palm-bay-wild-fire-may-16',
    name: 'Palm Bay Brush Fire',
    description: 'A brush fire in Palm Bay on May 16th, 2025',
    instagram: 'https://www.instagram.com/p/DIu49Q2A1_u/',
    photos: [
      { file: 'DSC01286.jpeg' },
      { file: 'DSC01407.jpeg' },
      { file: 'DSC01757.jpeg' },
      { file: 'DSC01827.jpeg' },
      { file: 'DSC02015.jpeg' },
      { file: 'DSC02024.jpeg' },
      { file: 'DSC02029.jpeg' },
      { file: 'DSC02046.jpeg' },
      { file: 'DSC02051.jpeg' },
      { file: 'DSC02133.jpeg' },
    ],
  },
  {
    slug: 'crew-10',
    name: 'SpaceX NASA Crew 10',
    description: [
      `What an incredible honor to witness NASA astronauts Anne McClain and Nichole Ayers, JAXA astronaut Takuya Onishi, and Roscosmos cosmonaut Kirill Peskov launch off our home planet.`,
      `Going behind the scenes at NASA Kennedy with NASA Social has been an unforgettable experience. Thank you to all the teams at NASA who made this opportunity possible. I’m truly grateful for the chance to see history in the making.`,
    ].join('\n\n'),
    instagram: 'https://www.instagram.com/p/DHNO2r1AE7e/',
    photos: [
      { file: 'DSC00183.jpeg' },
      { file: 'DSC00189.jpeg' },
      { file: 'DSC00288.jpeg' },
      { file: 'DSC00329.jpeg' },
      { file: 'DSC00349.jpeg' },
      { file: 'DSC00393.jpeg' },
      { file: 'DSC00403.jpeg' },
      { file: 'DSC00513.jpeg' },
      { file: 'DSC00514.jpeg' },
      { file: 'DSC00516.jpeg' },
      { file: 'DSC00524.jpeg' },
      { file: 'DSC00537.jpeg' },
      { file: 'DSC00599.jpeg' },
      { file: 'DSC00672.jpeg' },
      { file: 'IMG_1671.jpeg' },
      { file: 'IMG_1678.jpeg' },
      { file: 'IMG_1693.jpeg' },
      { file: 'IMG_1706.jpeg' },
      { file: 'IMG_1726.jpeg' },
    ],
  },
] as const;

export function getAlbumBySlug(
  slug: string,
): (typeof albums)[number] | undefined {
  return albums.find((album) => album.slug === slug);
}

export function getPhotoByFilename(albumSlug: string, file: string) {
  const album = getAlbumBySlug(albumSlug);
  if (!album) return undefined;

  const photoIndex = album.photos.findIndex((photo) => photo.file === file);

  if (photoIndex === -1) return undefined;

  const photo = album.photos[photoIndex];
  const prevPhoto = album.photos[photoIndex - 1];
  const nextPhoto = album.photos[photoIndex + 1];

  return {
    ...photo,
    album,
    prevFile: prevPhoto?.file,
    nextFile: nextPhoto?.file,
  };
}
