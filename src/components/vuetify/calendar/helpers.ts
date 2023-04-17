import {
  DAYS_IN_MONTH,
  DAYS_IN_MONTH_LEAP,
  DAYS_IN_MONTH_MIN,
  DAYS_IN_WEEK,
  DAY_MIN,
  MONTH_MAX,
  MONTH_MIN,
  OFFSET_HOUR,
  OFFSET_MONTH,
  OFFSET_YEAR,
} from "./constants";
import { CalendarTimestamp, CalendarTimestampOperation } from "./models";

export function getDayIdentifier(timestamp: {
  year: number;
  month: number;
  day: number;
}): number {
  return (
    timestamp.year * OFFSET_YEAR +
    timestamp.month * OFFSET_MONTH +
    timestamp.day
  );
}

export function copyTimestamp(timestamp: CalendarTimestamp): CalendarTimestamp {
  const {
    date,
    time,
    year,
    month,
    day,
    weekday,
    hour,
    minute,
    hasDay,
    hasTime,
    past,
    present,
    future,
  } = timestamp;

  return {
    date,
    time,
    year,
    month,
    day,
    weekday,
    hour,
    minute,
    hasDay,
    hasTime,
    past,
    present,
    future,
  };
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number) {
  return isLeapYear(year) ? DAYS_IN_MONTH_LEAP[month] : DAYS_IN_MONTH[month];
}

export function nextDay(timestamp: CalendarTimestamp): CalendarTimestamp {
  timestamp.day++;
  timestamp.weekday = (timestamp.weekday + 1) % DAYS_IN_WEEK;
  if (
    timestamp.day > DAYS_IN_MONTH_MIN &&
    timestamp.day > daysInMonth(timestamp.year, timestamp.month)
  ) {
    timestamp.day = DAY_MIN;
    timestamp.month++;
    if (timestamp.month > MONTH_MAX) {
      timestamp.month = MONTH_MIN;
      timestamp.year++;
    }
  }

  return timestamp;
}

export function padNumber(x: number, length: number): string {
  let padded = String(x);
  while (padded.length < length) {
    padded = "0" + padded;
  }

  return padded;
}

export function getTime(timestamp: CalendarTimestamp): string {
  if (!timestamp.hasTime) {
    return "";
  }

  return `${padNumber(timestamp.hour, 2)}:${padNumber(timestamp.minute, 2)}`;
}

export function getDate(timestamp: CalendarTimestamp): string {
  let str = `${padNumber(timestamp.year, 4)}-${padNumber(timestamp.month, 2)}`;

  if (timestamp.hasDay) str += `-${padNumber(timestamp.day, 2)}`;

  return str;
}

export function updateFormatted(
  timestamp: CalendarTimestamp
): CalendarTimestamp {
  timestamp.time = getTime(timestamp);
  timestamp.date = getDate(timestamp);

  return timestamp;
}

export function getTimeIdentifier(timestamp: {
  hour: number;
  minute: number;
}): number {
  return timestamp.hour * OFFSET_HOUR + timestamp.minute;
}

export function updateRelative(
  timestamp: CalendarTimestamp,
  now: CalendarTimestamp,
  time = false
): CalendarTimestamp {
  let a = getDayIdentifier(now);
  let b = getDayIdentifier(timestamp);
  let present = a === b;

  if (timestamp.hasTime && time && present) {
    a = getTimeIdentifier(now);
    b = getTimeIdentifier(timestamp);
    present = a === b;
  }

  timestamp.past = b < a;
  timestamp.present = present;
  timestamp.future = b > a;

  return timestamp;
}

export function relativeDays(
  timestamp: CalendarTimestamp,
  mover: CalendarTimestampOperation = nextDay,
  days = 1
): CalendarTimestamp {
  while (--days >= 0) mover(timestamp);

  return timestamp;
}

export function createDayList(
  start: CalendarTimestamp,
  end: CalendarTimestamp,
  now: CalendarTimestamp,
  weekdaySkips: number[],
  max = 42,
  min = 0
): CalendarTimestamp[] {
  const stop = getDayIdentifier(end);
  const days: CalendarTimestamp[] = [];
  let current = copyTimestamp(start);
  let currentIdentifier = 0;
  let stopped = currentIdentifier === stop;

  if (stop < getDayIdentifier(start)) {
    throw new Error("End date is earlier than start date.");
  }

  while ((!stopped || days.length < min) && days.length < max) {
    currentIdentifier = getDayIdentifier(current);
    stopped = stopped || currentIdentifier === stop;
    if (weekdaySkips[current.weekday] === 0) {
      current = nextDay(current);
      continue;
    }
    const day = copyTimestamp(current);
    updateFormatted(day);
    updateRelative(day, now);
    days.push(day);
    current = relativeDays(current, nextDay, weekdaySkips[current.weekday]);
  }

  if (!days.length)
    throw new Error(
      "No dates found using specified start date, end date, and weekdays."
    );

  return days;
}
