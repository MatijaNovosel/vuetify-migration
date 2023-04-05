<template>
  <div>Hello</div>
</template>

<script lang="ts" setup>
import { pad, sanitizeDateString, wrapInArray } from "@/utils/helpers";
import { computed, reactive } from "vue";

type ActivePicker = "DATE" | "MONTH" | "YEAR";
type DatePickerType = "date" | "month";
type DatePickerValue = string | string[] | undefined;
type DatePickerFormatter = (date: string) => string;

interface SubstrOptions {
  start?: number;
  length: number;
}

function createNativeLocaleFormatter(
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

const titleFormats: Record<string, Intl.DateTimeFormatOptions> = {
  year: { year: "numeric", timeZone: "UTC" },
  month: { month: "long", timeZone: "UTC" },
  date: { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" },
};

const props = defineProps<{
  activePicker: ActivePicker;
  allowedDates: (date: string) => boolean | undefined;
  dayFormat: (date: string) => boolean | undefined;
  disabled: boolean;
  events: any[] | Function | Object;
  eventColor: any[] | Function | Object | string;
  firstDayOfWeek: string | number;
  headerDateFormat: DatePickerFormatter;
  localeFirstDayOfYear: string | number;
  max: string;
  min: string;
  monthFormat: DatePickerFormatter | undefined;
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
    | DatePickerFormatter
    | ((date: string[]) => string)
    | undefined;
  type: DatePickerType;
  value: DatePickerValue;
  weekdayFormat: DatePickerFormatter | undefined;
  yearFormat: DatePickerFormatter | undefined;
  yearIcon: string;
  locale: string;
  flat: boolean;
  fullWidth: boolean;
  headerColor: string;
  landscape: boolean;
  noTitle: boolean;
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

const multipleValue = computed(() => {
  return wrapInArray(props.value);
});

const isMultiple = computed(() => props.multiple || props.range);

const lastValue = computed(() =>
  isMultiple.value
    ? multipleValue.value[multipleValue.value.length - 1]
    : (props.value as string | null)
);

const selectedMonths = computed(() => {
  if (!props.value || props.type === "month") {
    return props.value;
  } else if (isMultiple.value) {
    return multipleValue.value.map((val) => val.substring(0, 7));
  } else {
    return (props.value as string).substring(0, 7);
  }
});

const current = computed(() => {
  if (props.showCurrent === true) {
    return sanitizeDateString(
      `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      props.type
    );
  }
  return props.showCurrent || null;
});

const inputDate = computed(() =>
  props.type === "date"
    ? `${state.inputYear}-${pad(state.inputMonth! + 1)}-${pad(state.inputDay!)}`
    : `${state.inputYear}-${pad(state.inputMonth! + 1)}`
);

const tableMonth = computed(
  () => Number((props.pickerDate || state.tableDate).split("-")[1]) - 1
);

const tableYear = computed(() =>
  Number((props.pickerDate || state.tableDate).split("-")[0])
);

const minMonth = computed(() =>
  props.min ? sanitizeDateString(props.min, "month") : null
);

const maxMonth = computed(() =>
  props.max ? sanitizeDateString(props.max, "month") : null
);

const minYear = computed(() =>
  props.min ? sanitizeDateString(props.min, "year") : null
);

const maxYear = computed(() =>
  props.max ? sanitizeDateString(props.max, "year") : null
);

const formatters = computed(() => {
  return {
    year:
      props.yearFormat ||
      createNativeLocaleFormatter(
        props.locale,
        { year: "numeric", timeZone: "UTC" },
        { length: 4 }
      ),
    titleDate:
      props.titleDateFormat ||
      (isMultiple.value
        ? defaultTitleMultipleDateFormatter.value
        : defaultTitleDateFormatter.value),
  };
});

const defaultTitleMultipleDateFormatter = computed(() => {
  return (dates: string[]) => {
    if (!dates.length) return "-";
    if (dates.length === 1) return defaultTitleDateFormatter.value!(dates[0]);
    return "";
    // this.$vuetify.lang.t(props.selectedItemsText, dates.length);
  };
});

const defaultTitleDateFormatter = computed(() => {
  const titleDateFormatter = createNativeLocaleFormatter(
    props.locale,
    titleFormats[props.type],
    {
      start: 0,
      length: { date: 10, month: 7, year: 4 }[props.type],
    }
  );
  const landscapeFormatter = (date: string) =>
    titleDateFormatter!(date)
      .replace(
        /([^\d\s])([\d])/g,
        (match, nonDigit, digit) => `${nonDigit} ${digit}`
      )
      .replace(", ", ",<br>");
  return props.landscape ? landscapeFormatter : titleDateFormatter;
});
</script>
