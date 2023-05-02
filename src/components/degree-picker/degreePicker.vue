<template>
  <div :style="styles">
    <degree-picker-title
      :color="color"
      :hour="state.inputHour"
      :minute="state.inputMinute"
      :selecting="state.selecting"
      @update:selecting="(value: SelectingTimes) => (state.selecting = value)"
    />
    <degree-picker-body
      :color="color"
      @input="onInput"
      @change="onChange"
      :step="30"
      :min="0"
      :max="360"
      :selecting="state.selecting"
      :value="state.inputMinute"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";
import { SelectingTimes } from "./constants";
import degreePickerBody from "./degreePickerBody.vue";
import degreePickerTitle from "./degreePickerTitle.vue";
import { convertToUnit } from "./helpers";

const emit = defineEmits<{
  (e: "change", time: string): void;
  (e: "update:modelValue", value: string): void;
}>();

const props = defineProps<{
  disabled?: boolean;
  min?: string;
  max?: string;
  readonly?: boolean;
  fullWidth?: boolean;
  scrollable?: boolean;
  color?: string;
  modelValue: any;
  width?: number | string;
}>();

const state = reactive({
  inputHour: null as number | null,
  inputMinute: null as number | null,
  lazyInputHour: null as number | null,
  lazyInputMinute: null as number | null,
  selecting: SelectingTimes.Hour,
});

const setInputData = (value: string | null | Date) => {
  if (value == null || value === "") {
    state.inputHour = null;
    state.inputMinute = null;
  } else if (value instanceof Date) {
    state.inputHour = value.getHours();
    state.inputMinute = value.getMinutes();
  }
};

const styles = computed(() => ({
  width: props.fullWidth ? undefined : convertToUnit(props.width || 290),
}));

const genValue = () => {
  if (
    state.inputHour != null &&
    state.inputMinute != null
  ) {
    return state.inputHour.toString();
  }
  return null;
};

const emitValue = () => {
  const value = genValue();
  if (value !== null) emit("update:modelValue", value);
};

const onInput = (value: number) => {
  if (state.selecting === SelectingTimes.Hour) state.inputHour = value;
  else if (state.selecting === SelectingTimes.Minute) state.inputMinute = value;
  emitValue();
};

const onChange = () => {
  if (
    state.inputHour === state.lazyInputHour &&
    state.inputMinute === state.lazyInputMinute
  )
    return;

  const time = genValue();
  if (time === null) return;

  state.lazyInputHour = state.inputHour;
  state.lazyInputMinute = state.inputMinute;

  emit("change", time);
};

onMounted(() => setInputData(props.modelValue));
</script>
