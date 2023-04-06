<template>
  <div>
    <date-picker-title />
  </div>
</template>

<script lang="ts" setup>
import { pad, sanitizeDateString, wrapInArray } from "@/utils/helpers";
import { computed, reactive } from "vue";
import DatePickerTitle from "./datePickerTitle.vue";
import {
  createNativeLocaleFormatter,
  daysInMonth,
  isDateAllowed,
} from "./helpers";
import {
  ActivePicker,
  DatePickerAllowedDatesFunction,
  DatePickerFormatter,
  DatePickerType,
  DatePickerValue,
} from "./models";

const titleFormats: Record<string, Intl.DateTimeFormatOptions> = {
  year: { year: "numeric", timeZone: "UTC" },
  month: { month: "long", timeZone: "UTC" },
  date: { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" },
};

const emit = defineEmits(["input", "change"]);

const props = defineProps<{
  activePicker?: ActivePicker;
  allowedDates?: DatePickerAllowedDatesFunction | undefined;
  dayFormat?: DatePickerAllowedDatesFunction | undefined;
  disabled?: boolean;
  events?: any[] | Function | Object;
  eventColor?: any[] | Function | Object | string;
  firstDayOfWeek?: string | number;
  headerDateFormat?: DatePickerFormatter;
  localeFirstDayOfYear?: string | number;
  max: string;
  min: string;
  monthFormat?: DatePickerFormatter | undefined;
  multiple?: boolean;
  nextIcon?: string;
  nextMonthAriaLabel?: string;
  nextYearAriaLabel?: string;
  pickerDate?: string;
  prevIcon?: string;
  prevMonthAriaLabel?: string;
  prevYearAriaLabel?: string;
  range?: boolean;
  reactive?: boolean;
  readonly?: boolean;
  scrollable?: boolean;
  showCurrent?: boolean | string;
  selectedItemsText?: string;
  showAdjacentMonths?: boolean;
  showWeek?: boolean;
  titleDateFormat?:
    | DatePickerFormatter
    | ((date: string[]) => string)
    | undefined;
  type: DatePickerType;
  value: DatePickerValue;
  weekdayFormat?: DatePickerFormatter | undefined;
  yearFormat?: DatePickerFormatter | undefined;
  yearIcon?: string;
  locale?: string;
  flat?: boolean;
  fullWidth?: boolean;
  headerColor?: string;
  landscape?: boolean;
  noTitle?: boolean;
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

const emitInput = (newInput: string) => {
  if (props.range) {
    if (multipleValue.value.length !== 1) {
      emit("input", [newInput]);
    } else {
      const output = [multipleValue.value[0], newInput];
      emit("input", output);
      emit("change", output);
    }
    return;
  }

  const output = props.multiple
    ? multipleValue.value.indexOf(newInput) === -1
      ? multipleValue.value.concat([newInput])
      : multipleValue.value.filter((x) => x !== newInput)
    : newInput;

  emit("input", output);
  props.multiple || emit("change", newInput);
};

const checkMultipleProp = () => {
  if (props.value == null) return;
  const valueType = props.value.constructor.name;
  const expected = isMultiple.value ? "Array" : "String";
  if (valueType !== expected) {
    console.warn(
      `Value must be ${
        isMultiple.value ? "an" : "a"
      } ${expected}, got ${valueType}`
    );
  }
};

const isDateAllowedFn = (value: string) =>
  isDateAllowed(value, props.min, props.max, props.allowedDates);

const yearClick = (value: number) => {
  state.inputYear = value;
  if (props.type === "month") {
    state.tableDate = `${value}`;
  } else {
    state.tableDate = `${value}-${pad((tableMonth.value || 0) + 1)}`;
  }
  state.internalActivePicker = "MONTH";
  if (
    props.reactive &&
    !props.readonly &&
    !isMultiple.value &&
    isDateAllowedFn(inputDate.value)
  ) {
    emit("input", inputDate.value);
  }
};

const monthClick = (value: string) => {
  state.inputYear = parseInt(value.split("-")[0], 10);
  state.inputMonth = parseInt(value.split("-")[1], 10) - 1;
  if (props.type === "date") {
    if (state.inputDay) {
      state.inputDay = Math.min(
        state.inputDay,
        daysInMonth(state.inputYear, state.inputMonth + 1)
      );
    }
    state.tableDate = value;
    state.internalActivePicker = "DATE";
    if (
      props.reactive &&
      !props.readonly &&
      !isMultiple.value &&
      isDateAllowedFn(inputDate.value)
    ) {
      emit("input", inputDate.value);
    }
  } else {
    emitInput(inputDate.value);
  }
};

const dateClick = (value: string) => {
  state.inputYear = parseInt(value.split("-")[0], 10);
  state.inputMonth = parseInt(value.split("-")[1], 10) - 1;
  state.inputDay = parseInt(value.split("-")[2], 10);
  emitInput(inputDate.value);
};
</script>
