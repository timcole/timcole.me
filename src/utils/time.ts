export type FormattedTime = {
  abs: boolean;
  diff: FormattedTimeDiff;
};

export type FormattedTimeDiff = {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function formatTime(time: number): FormattedTime {
  const abs = time >= 0;
  if (!abs) time = Math.abs(time);

  const start = new Date(0);
  const target = new Date(time);

  let years = target.getUTCFullYear() - start.getUTCFullYear();
  let days = Math.floor(
    (target.getTime() -
      new Date(start.getUTCFullYear() + years, 0, 1).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const hours = target.getUTCHours();
  const minutes = target.getUTCMinutes();
  const seconds = target.getUTCSeconds();

  return {
    abs,
    diff: { years, days, hours, minutes, seconds },
  };
}

export function formatTimeToString(time: FormattedTime): string {
  const units: (keyof typeof time.diff)[] = [
    'years',
    'days',
    'hours',
    'minutes',
    'seconds',
  ];

  let result = [];
  for (const unit of units) {
    const value = time.diff[unit];

    if (value === 0) continue;
    let u = value === 1 ? unit.slice(0, -1) : unit;
    let v = `${value} ${u}`;
    result.push(v);
  }

  return result.join(', ');
}
