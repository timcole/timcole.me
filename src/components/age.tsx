'use client';

import { formatTime, formatTimeToString } from '@/utils/time';
import { FC, useEffect, useState } from 'react';

export const Age: FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    var timerID = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timerID);
  });

  return formatTimeToString(formatTime(858016920000 - now.getTime()));
};
