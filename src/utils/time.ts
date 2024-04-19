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

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const getDaysInYear = (year: number): number => (isLeapYear(year) ? 366 : 365);

export function formatTime(time: number): FormattedTime {
  const abs = time >= 0;
  if (!abs) time = Math.abs(time);

  let years = Math.floor(time / (1000 * 60 * 60 * 24 * 365));
  let days = Math.floor(
    (time % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24),
  );

  while (days >= getDaysInYear(years)) {
    days -= getDaysInYear(years);
    years++;
  }

  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);

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
