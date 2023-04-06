<template>
  <div class="v-date-picker-header"></div>
</template>

<script lang="ts" setup>
import { DatePickerFormatter } from "./models";

const props = defineProps<{
  disabled?: boolean;
  format?: DatePickerFormatter | undefined;
  min?: string;
  max?: string;
  nextAriaLabel?: string;
  nextIcon?: string;
  prevAriaLabel?: string;
  prevIcon?: string;
  readonly?: boolean;
  value: number | string;
}>();
</script>
