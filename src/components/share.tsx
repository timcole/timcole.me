'use client';

import { Share2 } from 'lucide-react';

export default function ShareButton() {
  if (!('share' in navigator)) return;

  return (
    <button
      className="flex items-center gap-1 text-cyan-500 font-mono text-sm hover:underline cursor-pointer"
      onClick={() => {
        navigator.share({
          text: "@modesttim's photo",
          url: window.location.href,
        });
      }}
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  );
}
