<template>
  <div>Hello</div>
</template>

<script lang="ts" setup>
import { sanitizeDateString, wrapInArray } from "@/utils/helpers";
import { reactive } from "vue";

type ActivePicker = "DATE" | "MONTH" | "YEAR";
type DatePickerType = "date" | "month";
type DatePickerValue = string | string[] | undefined;

const props = defineProps<{
  activePicker: ActivePicker;
  allowedDates: (date: string) => boolean | undefined;
  dayFormat: (date: string) => boolean | undefined;
  disabled: boolean;
  events: any[] | Function | Object;
  eventColor: any[] | Function | Object | string;
  firstDayOfWeek: string | number;
  headerDateFormat: (date: string) => string;
  localeFirstDayOfYear: string | number;
  max: string;
  min: string;
  monthFormat: (date: string) => string | undefined;
  multiple: boolean;
  nextIcon: string;
  nextMonthAriaLabel: string;
  nextYearAriaLabel: string;
  pickerDate: string;
  prevIcon: string;
  prevMonthAriaLabel: string;
  prevYearAriaLabel: string;
  range: boolean;
  reactive: boolean;
  readonly: boolean;
  scrollable: boolean;
  showCurrent: boolean | string;
  selectedItemsText: string;
  showAdjacentMonths: boolean;
  showWeek: boolean;
  titleDateFormat:
    | ((date: string) => string)
    | ((date: string[]) => string)
    | undefined;
  type: DatePickerType;
  value: DatePickerValue;
  weekdayFormat: (date: string) => string | undefined;
  yearFormat: (date: string) => string | undefined;
  yearIcon: string;
}>();

const now = new Date();

const state = reactive({
  internalActivePicker: "",
  inputDay: null as number | null,
  inputMonth: null as number | null,
  inputYear: null as number | null,
  isReversing: false,
  now: new Date(),
  tableDate: (() => {
    if (props.pickerDate) return props.pickerDate;
    const multipleValue = wrapInArray(props.value);
    const date =
      multipleValue[multipleValue.length - 1] ||
      (typeof props.showCurrent === "string"
        ? props.showCurrent
        : `${now.getFullYear()}-${now.getMonth() + 1}`);
    return sanitizeDateString(
      date as string,
      props.type === "date" ? "month" : "year"
    );
  })(),
});
</script>
