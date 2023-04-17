export const DAYS_IN_MONTH: number[] = [
  0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
];
export const DAYS_IN_MONTH_LEAP: number[] = [
  0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
];
export const DAYS_IN_MONTH_MIN = 28;
export const DAYS_IN_MONTH_MAX = 31;
export const MONTH_MAX = 12;
export const MONTH_MIN = 1;
export const DAY_MIN = 1;
export const DAYS_IN_WEEK = 7;
export const MINUTES_IN_HOUR = 60;
export const MINUTE_MAX = 59;
export const MINUTES_IN_DAY = 24 * 60;
export const HOURS_IN_DAY = 24;
export const HOUR_MAX = 23;
export const FIRST_HOUR = 0;
export const OFFSET_YEAR = 10000;
export const OFFSET_MONTH = 100;
export const OFFSET_HOUR = 100;
export const OFFSET_TIME = 10000;
export const PARSE_REGEX =
  /^(\d{4})-(\d{1,2})(-(\d{1,2}))?([^\d]+(\d{1,2}))?(:(\d{1,2}))?(:(\d{1,2}))?$/;
export const PARSE_TIME = /(\d\d?)(:(\d\d?)|)(:(\d\d?)|)/;
