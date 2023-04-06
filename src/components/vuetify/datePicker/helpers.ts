import { pad } from "@/utils/helpers";
import { DAYS_IN_MONTH, DAYS_IN_MONTH_LEAP } from "./constants";
import {
  DatePickerAllowedDatesFunction,
  DatePickerFormatter,
  SubstrOptions,
} from "./models";

export function createNativeLocaleFormatter(
  locale: string | undefined,
  options: Intl.DateTimeFormatOptions,
  substrOptions: SubstrOptions = { start: 0, length: 0 }
): DatePickerFormatter | undefined {
  const makeIsoString = (dateString: string) => {
    const [year, month, date] = dateString.trim().split(" ")[0].split("-");
    return [pad(year, 4), pad(month || 1), pad(date || 1)].join("-");
  };
  try {
    const intlFormatter = new Intl.DateTimeFormat(locale || undefined, options);
    return (dateString: string) =>
      intlFormatter.format(
        new Date(`${makeIsoString(dateString)}T00:00:00+00:00`)
      );
  } catch (e) {
    return substrOptions.start || substrOptions.length
      ? (dateString: string) =>
          makeIsoString(dateString).substr(
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
