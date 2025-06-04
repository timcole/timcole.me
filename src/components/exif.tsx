import exifr from 'exifr';
import { Aperture, Camera, Clock } from 'lucide-react';
import { unstable_cache } from 'next/cache';
import { memo } from 'react';

const formatNumber = (num: number) =>
  Number.isInteger(num)
    ? num.toString()
    : parseFloat(num.toFixed(3)).toString();

async function ExifData({ url }: { url: string }) {
  const exif = await unstable_cache(() => exifr.parse(url), [url])();

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

export default memo(ExifData);
