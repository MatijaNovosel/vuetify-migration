<template>
  <div :style="styles">
    <date-picker-title
      v-if="!noTitle"
      :color="color"
      :date="pickerTitle"
      :year="pad(tableYear, 4)"
      :selecting-year="state.internalActivePicker === 'YEAR'"
      @select-year="(value: boolean) => state.internalActivePicker = value ? 'YEAR' : 'DATE'"
    />
    <date-picker-header
      v-if="['DATE', 'MONTH'].includes(state.internalActivePicker)"
      :color="color"
      :value="
        state.internalActivePicker === 'DATE'
          ? `${pad(tableYear, 4)}-${pad(tableMonth + 1)}`
          : `${pad(tableYear, 4)}`
      "
      @input="(value: string) => state.tableDate = value"
      @toggle="
        state.internalActivePicker =
          state.internalActivePicker === 'DATE' ? 'MONTH' : 'YEAR'
      "
    />
    <date-picker-date-table
      v-if="state.internalActivePicker === 'DATE'"
      :value="value"
      :color="color"
      :table-date="`${pad(tableYear, 4)}-${pad(tableMonth + 1)}`"
      @input="dateClick"
    />
    <date-picker-month-table
      v-else-if="state.internalActivePicker === 'MONTH'"
      :value="selectedMonths"
      :color="color"
      :table-date="pad(tableYear, 4)"
      @update:table-date="(value: string) => state.tableDate = value"
      @input="monthClick"
    />
    <date-picker-years
      @input="yearClick"
      :value="tableYear"
      :color="color"
      v-else
    />
  </div>
</template>

<script lang="ts" setup>
import {
  convertToUnit,
  pad,
  sanitizeDateString,
  wrapInArray,
} from "@/utils/helpers";
import { computed, onMounted, reactive, watch } from "vue";
import { titleFormats } from "./constants";
import DatePickerDateTable from "./datePickerDateTable.vue";
import DatePickerHeader from "./datePickerHeader.vue";
import DatePickerMonthTable from "./datePickerMonthTable.vue";
import DatePickerTitle from "./datePickerTitle.vue";
import DatePickerYears from "./datePickerYears.vue";
import {
  createNativeLocaleFormatter,
  daysInMonth,
  isDateAllowed,
} from "./helpers";
import {
  DatePickerAllowedDatesFunction,
  DatePickerEventColors,
  DatePickerEvents,
  DatePickerValue,
} from "./models";

const emit = defineEmits(["input", "change"]);

const props = defineProps<{
  allowedDates?: DatePickerAllowedDatesFunction;
  disabled?: boolean;
  events?: DatePickerEvents;
  eventColor?: DatePickerEventColors;
  firstDayOfWeek?: string | number;
  max: string;
  min: string;
  multiple?: boolean;
  pickerDate?: string;
  range?: boolean;
  readonly?: boolean;
  showCurrent?: boolean | string;
  selectedItemsText?: string;
  showAdjacentMonths?: boolean;
  value: DatePickerValue;
  locale?: string;
  fullWidth?: boolean;
  noTitle?: boolean;
  width?: number | string;
  color?: string;
}>();

const styles = computed(() => ({
  width: props.fullWidth ? undefined : convertToUnit(props.width || 290),
}));

const pickerTitle = computed(() =>
  (formatters.value.titleDate as (value: any) => string)!(
    isMultiple.value ? multipleValue.value : props.value
  )
);

const now = new Date();

const state = reactive({
  internalActivePicker: "DATE",
  inputDay: null as number | null,
  inputMonth: null as number | null,
  inputYear: null as number | null,
  isReversing: false,
  tableDate: now.toISOString().substring(0, 10),
});

const multipleValue = computed(() => wrapInArray(props.value));

const isMultiple = computed(() => props.multiple || props.range);

const lastValue = computed(() =>
  isMultiple.value
    ? multipleValue.value[multipleValue.value.length - 1]
    : (props.value as string | null)
);

const selectedMonths = computed(() => {
  if (!props.value) {
    return props.value;
  } else if (isMultiple.value) {
    return multipleValue.value.map((val) => val.substring(0, 7));
  } else {
    return (props.value as string).substring(0, 7);
  }
});

const inputDate = computed(
  () =>
    `${state.inputYear}-${pad(state.inputMonth! + 1)}-${pad(state.inputDay!)}`
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

const formatters = computed(() => ({
  year: createNativeLocaleFormatter(
    props.locale,
    { year: "numeric", timeZone: "UTC" },
    { length: 4 }
  ),
  titleDate: isMultiple.value
    ? defaultTitleMultipleDateFormatter.value
    : defaultTitleDateFormatter.value,
}));

const defaultTitleMultipleDateFormatter = computed(() => (dates: string[]) => {
  if (!dates.length) return "-";
  if (dates.length === 1) return defaultTitleDateFormatter.value!(dates[0]);
  return "";
  // this.$vuetify.lang.t(props.selectedItemsText, dates.length);
});

const defaultTitleDateFormatter = computed(() =>
  createNativeLocaleFormatter(props.locale, titleFormats["date"], {
    start: 0,
    length: { date: 10, month: 7, year: 4 }["date"],
  })
);

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

const yearClick = (value: number) => {
  console.log(value);
  state.inputYear = value;
  state.tableDate = `${value}-${pad((tableMonth.value || 0) + 1)}`;
  state.internalActivePicker = "MONTH";
  if (
    !props.readonly &&
    !isMultiple.value &&
    isDateAllowed(inputDate.value, props.min, props.max, props.allowedDates)
  ) {
    emit("input", inputDate.value);
  }
};

const monthClick = (value: string) => {
  state.inputYear = parseInt(value.split("-")[0], 10);
  state.inputMonth = parseInt(value.split("-")[1], 10) - 1;
  if (state.inputDay) {
    state.inputDay = Math.min(
      state.inputDay,
      daysInMonth(state.inputYear, state.inputMonth + 1)
    );
  }
  state.tableDate = value;
  state.internalActivePicker = "DATE";
  if (
    !props.readonly &&
    !isMultiple.value &&
    isDateAllowed(inputDate.value, props.min, props.max, props.allowedDates)
  ) {
    emit("input", inputDate.value);
  }
};

const dateClick = (value: string) => {
  state.inputYear = parseInt(value.split("-")[0], 10);
  state.inputMonth = parseInt(value.split("-")[1], 10) - 1;
  state.inputDay = parseInt(value.split("-")[2], 10);
  emitInput(inputDate.value);
};

const setInputDate = () => {
  if (lastValue.value) {
    const array = lastValue.value.split("-");
    state.inputYear = parseInt(array[0], 10);
    state.inputMonth = parseInt(array[1], 10) - 1;
    state.inputDay = parseInt(array[2], 10);
  } else {
    state.inputYear = state.inputYear || now.getFullYear();
    state.inputMonth =
      state.inputMonth == null ? state.inputMonth : now.getMonth();
    state.inputDay = state.inputDay || now.getDate();
  }
};

watch(
  () => props.value,
  (val) => {
    checkMultipleProp();
    setInputDate();
    if (
      (!isMultiple.value && props.value && !props.pickerDate) ||
      (isMultiple.value &&
        multipleValue.value.length &&
        (!val || !val.length) &&
        !props.pickerDate)
    ) {
      state.tableDate = sanitizeDateString(inputDate.value, "month");
    }
  }
);

onMounted(() => {
  if (props.pickerDate) return props.pickerDate;
  const multipleValue = wrapInArray(props.value);
  const date =
    multipleValue[multipleValue.length - 1] ||
    (typeof props.showCurrent === "string"
      ? props.showCurrent
      : `${now.getFullYear()}-${now.getMonth() + 1}`);
  state.tableDate = sanitizeDateString(date as string, "month");
});
</script>
