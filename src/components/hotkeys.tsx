'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HotkeysProps {
  left?: string;
  right?: string;
  esc: string;
}

const Hotkeys: React.FC<HotkeysProps> = ({ left, right, esc }) => {
  const router = useRouter();

  useEffect(() => {
    const keyHandlers: Record<string, () => void> = {
      Escape: () => router.push(esc),
      ArrowLeft: () => left && router.push(left),
      ArrowRight: () => right && router.push(right),
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const handler = keyHandlers[event.key];
      if (handler) handler();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, left, right, esc]);

  return null;
};

export default Hotkeys;
