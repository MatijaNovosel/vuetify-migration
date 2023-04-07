import { pad } from "@/utils/helpers";
import { DAYS_IN_MONTH, DAYS_IN_MONTH_LEAP } from "./constants";
import {
  DatePickerAllowedDatesFunction,
  DatePickerFormatter,
  SubstrOptions,
} from "./models";

const makeIsoString = (dateString: string) => {
  const [year, month, date] = dateString.trim().split(" ")[0].split("-");
  return [pad(year, 4), pad(month || 1), pad(date || 1)].join("-");
};

export function createNativeLocaleFormatter(
  locale: string | undefined,
  options: Intl.DateTimeFormatOptions,
  substrOptions: SubstrOptions = { start: 0, length: 0 }
): DatePickerFormatter | undefined {
  try {
    const intlFormatter = new Intl.DateTimeFormat(locale || undefined, options);
    return (dateString: string) => {
      console.log(dateString);
      return intlFormatter.format(
        new Date(`${makeIsoString(dateString)}T00:00:00+00:00`)
      );
    };
  } catch (e) {
    return substrOptions.start || substrOptions.length
      ? (dateString: string) =>
          makeIsoString(dateString).substring(
            substrOptions.start || 0,
            substrOptions.length
          )
      : undefined;
  }
}

export function isDateAllowed(
  date: string,
  min: string,
  max: string,
  allowedFn: DatePickerAllowedDatesFunction | undefined
) {
  return (
    (!allowedFn || allowedFn(date)) &&
    (!min || date >= min.substr(0, 10)) &&
    (!max || date <= max)
  );
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number) {
  return isLeapYear(year) ? DAYS_IN_MONTH_LEAP[month] : DAYS_IN_MONTH[month];
}

function createUTCDate(year: number, month = 0, day = 1) {
  let date;
  if (year < 100 && year >= 0) {
    date = new Date(Date.UTC(year, month, day));
    if (isFinite(date.getUTCFullYear())) {
      date.setUTCFullYear(year);
    }
  } else {
    date = new Date(Date.UTC(year, month, day));
  }

  return date;
}

function firstWeekOffset(
  year: number,
  firstDayOfWeek: number,
  firstDayOfYear: number
) {
  const firstWeekDayInFirstWeek = 7 + firstDayOfWeek - firstDayOfYear;
  const firstWeekDayOfYear =
    (7 +
      createUTCDate(year, 0, firstWeekDayInFirstWeek).getUTCDay() -
      firstDayOfWeek) %
    7;

  return -firstWeekDayOfYear + firstWeekDayInFirstWeek - 1;
}

function dayOfYear(
  year: number,
  month: number,
  day: number,
  firstDayOfWeek: number
) {
  let dayOfYear = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334][
    month
  ];
  if (month > 1 && isLeapYear(year)) dayOfYear++;
  return dayOfYear + day;
}

function weeksInYear(
  year: number,
  firstDayOfWeek: number,
  firstDayOfYear: number
) {
  const weekOffset = firstWeekOffset(year, firstDayOfWeek, firstDayOfYear);
  const weekOffsetNext = firstWeekOffset(
    year + 1,
    firstDayOfWeek,
    firstDayOfYear
  );
  const daysInYear = isLeapYear(year) ? 366 : 365;

  return (daysInYear - weekOffset + weekOffsetNext) / 7;
}

export function weekNumber(
  year: number,
  month: number,
  day: number,
  firstDayOfWeek: number,
  localeFirstDayOfYear: number
): number {
  const weekOffset = firstWeekOffset(
    year,
    firstDayOfWeek,
    localeFirstDayOfYear
  );
  const week = Math.ceil(
    (dayOfYear(year, month, day, firstDayOfWeek) - weekOffset) / 7
  );

  if (week < 1) {
    return week + weeksInYear(year - 1, firstDayOfWeek, localeFirstDayOfYear);
  } else if (week > weeksInYear(year, firstDayOfWeek, localeFirstDayOfYear)) {
    return week - weeksInYear(year, firstDayOfWeek, localeFirstDayOfYear);
  } else {
    return week;
  }
}
