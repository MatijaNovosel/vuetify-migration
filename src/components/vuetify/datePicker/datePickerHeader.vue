<template>
  <div class="v-date-picker-header" :class="classes">
    <v-btn icon>
      <v-icon> mdi-chevron-left </v-icon>
    </v-btn>
    <div class="v-date-picker-header__value">
      <transition
        :name="state.isReversing ? 'tab-reverse-transition' : 'tab-transition'"
      >
        <button>
          {{ formatter!(value.toString()) }}
        </button>
      </transition>
    </div>
    <v-btn icon>
      <v-icon> mdi-chevron-right </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { createNativeLocaleFormatter } from "./helpers";
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
  currentLocale?: string;
  value: number | string;
}>();

const state = reactive({
  isReversing: false,
});

const formatter = computed(() => {
  if (props.format) {
    return props.format;
  } else if (String(props.value).split("-")[1]) {
    return createNativeLocaleFormatter(
      props.currentLocale || "en-us",
      { month: "long", year: "numeric", timeZone: "UTC" },
      { length: 7 }
    );
  } else {
    return createNativeLocaleFormatter(
      props.currentLocale || "en-us",
      { year: "numeric", timeZone: "UTC" },
      { length: 4 }
    );
  }
});

const classes = computed(() => ({
  "v-date-picker-header--disabled": props.disabled,
}));
</script>

<style lang="sass" scoped>
@import "./variables.scss"

.v-date-picker-header
  padding: $date-picker-header-padding

  align-items: center
  display: flex
  justify-content: space-between
  position: relative

  .v-btn
    margin: 0
    z-index: auto

  .v-icon
    cursor: pointer
    user-select: none

.v-date-picker-header__value
  flex: 1
  text-align: center
  position: relative
  overflow: hidden

  div
    transition: $date-picker-header-value-transition
    width: 100%

  button
    cursor: pointer
    font-weight: $date-picker-header-button-font-weight
    outline: none
    padding: $date-picker-header-button-padding
    transition: $date-picker-header-button-transition

.v-date-picker-header--disabled
  pointer-events: none
</style>
