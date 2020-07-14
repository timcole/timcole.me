let isRaining: boolean = false;
const totalImages: number = 25;
const fps = 40;
const duration = 15;

const images = [
  'https://static-cdn.jtvnw.net/emoticons/v1/2010088/4.0',
  'https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/3x',
  'https://static-cdn.jtvnw.net/emoticons/v1/301396453/4.0',
];

function animateImage(i: number): void {
  let image = document.querySelector(
    `img.celebration[data-index="${i}"]`
  ) as HTMLImageElement;
  if (!image) return;

  image.style.top = `${parseInt(image.style.top, 10) + 8}px`;
  if (parseInt(image.style.top, 10) >= window.innerHeight)
    image.style.top = '-50px';

  image.style.left = `${
    parseInt(image.style.left, 10) +
    (image.dataset.isLeft == 'true'
      ? +image.dataset.speed
      : -image.dataset.speed)
  }px`;
  if (
    parseInt(image.style.left, 10) >= window.innerWidth ||
    parseInt(image.style.left, 10) <= 0
  )
    image.dataset.isLeft = image.dataset.isLeft == 'true' ? 'false' : 'true';

  setTimeout(function () {
    animateImage(i);
  }, 1000 / fps);
}

export async function rainDown(done: () => void): Promise<void> {
  if (isRaining) return;
  isRaining = true;

  let isLeft = false;
  for (let i = 0; i < totalImages; i++) {
    let image = document.createElement('img');
    image.src = images[Math.floor(Math.random() * images.length)];
    image.className = 'celebration';
    image.dataset.index = i.toString();
    isLeft = !isLeft;
    image.dataset.isLeft = isLeft.toString();
    image.dataset.speed = (Math.floor(Math.random() * 5) + 1).toString();
    image.style.top = `${Math.floor(Math.random() * window.innerHeight)}px`;
    image.style.left = `${Math.floor(Math.random() * window.innerWidth)}px`;
    image.style.height = '50px';
    image.style.position = 'fixed';
    image.style.zIndex = '10';
    document.body.append(image);

    animateImage(i);
  }

  setTimeout(function () {
    for (let i = 0; i < totalImages; i++) {
      let image = document.querySelector(`img.celebration[data-index="${i}"]`);
      if (image) image.remove();
      isRaining = false;
    }
    done();
  }, duration * 1000);
}
