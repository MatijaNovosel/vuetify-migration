<template>
  <div>
    <time-picker-title
      :hour="state.inputHour"
      :minute="state.inputMinute"
      :second="state.inputSecond"
    />
  </div>
</template>

<script lang="ts" setup>
import { createRange } from "@/utils/helpers";
import { onMounted, reactive } from "vue";
import timePickerTitle from "./timePickerTitle.vue";

enum SelectingTimes {
  Hour = 1,
  Minute = 2,
  Second = 3,
}

const rangeHours24 = createRange(24);
const range60 = createRange(60);
const selectingNames = { 1: "hour", 2: "minute", 3: "second" };

const props = defineProps<{
  disabled?: boolean;
  min?: string;
  max?: string;
  readonly?: boolean;
  scrollable?: boolean;
  useSeconds?: boolean;
  color?: string;
  value: any;
}>();

const state = reactive({
  inputHour: null as number | null,
  inputMinute: null as number | null,
  inputSecond: null as number | null,
  lazyInputHour: null as number | null,
  lazyInputMinute: null as number | null,
  lazyInputSecond: null as number | null,
  selecting: SelectingTimes.Hour,
});

const setInputData = (value: string | null | Date) => {
  if (value == null || value === "") {
    state.inputHour = null;
    state.inputMinute = null;
    state.inputSecond = null;
  } else if (value instanceof Date) {
    state.inputHour = value.getHours();
    state.inputMinute = value.getMinutes();
    state.inputSecond = value.getSeconds();
  }
};

onMounted(() => {
  setInputData(props.value);
});
</script>
