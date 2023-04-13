<template>
  <div class="v-picker v-picker--time" :style="styles">
    <time-picker-title
      color="green"
      :hour="state.inputHour"
      :minute="state.inputMinute"
      :second="state.inputSecond"
      :selecting="state.selecting"
      @update:selecting="(value: 1 | 2 | 3) => (state.selecting = value)"
    />
    <time-picker-clock
      @input="onInput"
      @change="onChange"
      :step="state.selecting === SelectingTimes.Hour ? 1 : 5"
      :double="state.selecting === SelectingTimes.Hour"
      :min="0"
      :max="state.selecting === SelectingTimes.Hour ? 23 : 59"
      :value="
        state.selecting === SelectingTimes.Hour
          ? state.inputHour
          : state.selecting === SelectingTimes.Minute
          ? state.inputMinute
          : state.inputSecond
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { convertToUnit, pad } from "@/utils/helpers";
import { computed, onMounted, reactive } from "vue";
import { SelectingTimes } from "./constants";
import timePickerClock from "./timePickerClock.vue";
import timePickerTitle from "./timePickerTitle.vue";

const emit = defineEmits([
  "input",
  "change",
  "click:hour",
  "click:minute",
  "click:second",
]);

const props = defineProps<{
  disabled?: boolean;
  min?: string;
  max?: string;
  readonly?: boolean;
  fullWidth?: boolean;
  scrollable?: boolean;
  useSeconds?: boolean;
  color?: string;
  value: any;
  width?: number | string;
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

const styles = computed(() => ({
  width: props.fullWidth ? undefined : convertToUnit(props.width || 290),
}));

const genValue = () => {
  if (
    state.inputHour != null &&
    state.inputMinute != null &&
    (!props.useSeconds || state.inputSecond != null)
  ) {
    return (
      `${pad(state.inputHour)}:${pad(state.inputMinute)}` +
      (props.useSeconds ? `:${pad(state.inputSecond!)}` : "")
    );
  }
  return null;
};

const emitValue = () => {
  const value = genValue();
  if (value !== null) emit("input", value);
};

const onInput = (value: number) => {
  if (state.selecting === SelectingTimes.Hour) state.inputHour = value;
  else if (state.selecting === SelectingTimes.Minute) state.inputMinute = value;
  else state.inputSecond = value;
  emitValue();
};

const onChange = (value: number) => {
  switch (state.selecting) {
    case 1:
      emit("click:hour", value);
      break;
    case 2:
      emit("click:minute", value);
      break;
    case 3:
      emit("click:second", value);
      break;
  }

  const emitChange =
    state.selecting ===
    (props.useSeconds ? SelectingTimes.Second : SelectingTimes.Minute);

  if (
    state.inputHour === state.lazyInputHour &&
    state.inputMinute === state.lazyInputMinute &&
    (!props.useSeconds || state.inputSecond === state.lazyInputSecond)
  )
    return;

  const time = genValue();
  if (time === null) return;

  state.lazyInputHour = state.inputHour;
  state.lazyInputMinute = state.inputMinute;
  props.useSeconds && (state.lazyInputSecond = state.inputSecond);

  emitChange && emit("change", time);
};

onMounted(() => {
  setInputData(props.value);
});
</script>
