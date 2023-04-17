export type CalendarCategory =
  | string
  | {
      name?: string;
      categoryName?: string;
      [key: string]: any;
    };

export interface CalendarTimestamp {
  date: string;
  time: string;
  year: number;
  month: number;
  day: number;
  weekday: number;
  hour: number;
  minute: number;
  hasDay: boolean;
  hasTime: boolean;
  past: boolean;
  present: boolean;
  future: boolean;
  category?: CalendarCategory;
}

export type CalendarFormatter = (
  timestamp: CalendarTimestamp,
  short: boolean
) => string;

export type CalendarCategoryTextFunction = (
  category: CalendarCategory
) => string;

export interface CalendarTimestamp {
  date: string;
  time: string;
  year: number;
  month: number;
  day: number;
  weekday: number;
  hour: number;
  minute: number;
  hasDay: boolean;
  hasTime: boolean;
  past: boolean;
  present: boolean;
  future: boolean;
  category?: CalendarCategory;
}

export type CalendarTimestampOperation = (
  timestamp: CalendarTimestamp
) => CalendarTimestamp;
