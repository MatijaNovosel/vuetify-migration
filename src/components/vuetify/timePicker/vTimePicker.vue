<template>
  <div :style="styles">
    <time-picker-title
      color="green"
      :hour="state.inputHour"
      :minute="state.inputMinute"
      :second="state.inputSecond"
    />
    <time-picker-clock
      :step="state.selecting === SelectingTimes.Hour ? 1 : 5"
      :double="state.selecting === SelectingTimes.Hour"
      :min="0"
      :max="59"
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
import { convertToUnit } from "@/utils/helpers";
import { computed, onMounted, reactive } from "vue";
import timePickerClock from "./timePickerClock.vue";
import timePickerTitle from "./timePickerTitle.vue";

enum SelectingTimes {
  Hour = 1,
  Minute = 2,
  Second = 3,
}

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

onMounted(() => {
  setInputData(props.value);
});
</script>
