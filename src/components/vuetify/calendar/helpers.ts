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
  PARSE_REGEX,
} from "./constants";
import {
  CalendarTimestamp,
  CalendarTimestampOperation,
  VTimestampInput,
} from "./models";

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

export function parseDate(date: Date): CalendarTimestamp {
  return updateFormatted({
    date: "",
    time: "",
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: date.getDay(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    hasDay: true,
    hasTime: true,
    past: false,
    present: true,
    future: false,
  });
}

export function getWeekday(timestamp: CalendarTimestamp): number {
  if (timestamp.hasDay) {
    const _ = Math.floor;
    const k = timestamp.day;
    const m = ((timestamp.month + 9) % MONTH_MAX) + 1;
    const C = _(timestamp.year / 100);
    const Y = (timestamp.year % 100) - (timestamp.month <= 2 ? 1 : 0);

    return (
      (((k + _(2.6 * m - 0.2) - 2 * C + Y + _(Y / 4) + _(C / 4)) % 7) + 7) % 7
    );
  }

  return timestamp.weekday;
}

export function updateWeekday(timestamp: CalendarTimestamp): CalendarTimestamp {
  timestamp.weekday = getWeekday(timestamp);
  return timestamp;
}

export function parseTimestamp(
  input: VTimestampInput,
  required = false,
  now?: CalendarTimestamp
): CalendarTimestamp | null {
  if (typeof input === "number" && isFinite(input)) {
    input = new Date(input);
  }

  if (input instanceof Date) {
    const date: CalendarTimestamp = parseDate(input);

    if (now) {
      updateRelative(date, now, date.hasTime);
    }

    return date;
  }

  if (typeof input !== "string") {
    if (required) {
      throw new Error(
        `${input} is not a valid timestamp. It must be a Date, number of milliseconds since Epoch, or a string in the format of YYYY-MM-DD or YYYY-MM-DD hh:mm. Zero-padding is optional and seconds are ignored.`
      );
    }
    return null;
  }

  // YYYY-MM-DD hh:mm:ss
  const parts = PARSE_REGEX.exec(input);

  if (!parts) {
    if (required) {
      throw new Error(
        `${input} is not a valid timestamp. It must be a Date, number of milliseconds since Epoch, or a string in the format of YYYY-MM-DD or YYYY-MM-DD hh:mm. Zero-padding is optional and seconds are ignored.`
      );
    }

    return null;
  }

  const timestamp: CalendarTimestamp = {
    date: input,
    time: "",
    year: parseInt(parts[1]),
    month: parseInt(parts[2]),
    day: parseInt(parts[4]) || 1,
    hour: parseInt(parts[6]) || 0,
    minute: parseInt(parts[8]) || 0,
    weekday: 0,
    hasDay: !!parts[4],
    hasTime: !!(parts[6] && parts[8]),
    past: false,
    present: false,
    future: false,
  };

  updateWeekday(timestamp);
  updateFormatted(timestamp);

  if (now) {
    updateRelative(timestamp, now, timestamp.hasTime);
  }

  return timestamp;
}

export function findWeekday(
  timestamp: CalendarTimestamp,
  weekday: number,
  mover: CalendarTimestampOperation = nextDay,
  maxDays = 6
): CalendarTimestamp {
  while (timestamp.weekday !== weekday && --maxDays >= 0) mover(timestamp);

  return timestamp;
}

export function prevDay(timestamp: CalendarTimestamp): CalendarTimestamp {
  timestamp.day--;
  timestamp.weekday = (timestamp.weekday + 6) % DAYS_IN_WEEK;
  if (timestamp.day < DAY_MIN) {
    timestamp.month--;
    if (timestamp.month < MONTH_MIN) {
      timestamp.year--;
      timestamp.month = MONTH_MAX;
    }
    timestamp.day = daysInMonth(timestamp.year, timestamp.month);
  }

  return timestamp;
}

export function getStartOfWeek(
  timestamp: CalendarTimestamp,
  weekdays: number[],
  today?: CalendarTimestamp
): CalendarTimestamp {
  const start = copyTimestamp(timestamp);
  findWeekday(start, weekdays[0], prevDay);
  updateFormatted(start);
  if (today) {
    updateRelative(start, today, start.hasTime);
  }

  return start;
}

export function getEndOfWeek(
  timestamp: CalendarTimestamp,
  weekdays: number[],
  today?: CalendarTimestamp
): CalendarTimestamp {
  const end = copyTimestamp(timestamp);
  findWeekday(end, weekdays[weekdays.length - 1]);
  updateFormatted(end);
  if (today) {
    updateRelative(end, today, end.hasTime);
  }

  return end;
}

export function getWeekdaySkips(weekdays: number[]): number[] {
  const skips: number[] = [1, 1, 1, 1, 1, 1, 1];
  const filled: number[] = [0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < weekdays.length; i++) {
    filled[weekdays[i]] = 1;
  }
  for (let k = 0; k < DAYS_IN_WEEK; k++) {
    let skip = 1;
    for (let j = 1; j < DAYS_IN_WEEK; j++) {
      const next = (k + j) % DAYS_IN_WEEK;
      if (filled[next]) {
        break;
      }
      skip++;
    }
    skips[k] = filled[k] * skip;
  }

  return skips;
}
