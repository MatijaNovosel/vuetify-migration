export type ActivePicker = "DATE" | "MONTH" | "YEAR";
export type DatePickerType = "date" | "month";
export type DatePickerValue = string | string[] | undefined;
export type DatePickerFormatter = (date: string) => string;
export type DatePickerAllowedDatesFunction = (date: string) => boolean;

export interface SubstrOptions {
  start?: number;
  length: number;
}
