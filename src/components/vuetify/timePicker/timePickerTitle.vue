<template>
  <div class="v-time-picker-title">
    <div class="v-time-picker-title__time">
      <v-btn>
        {{ hour == null ? "--" : pad(hour) }}
      </v-btn>
      <span> : </span>
      <v-btn>
        {{ minute == null ? "--" : pad(minute) }}
      </v-btn>
      <template v-if="useSeconds">
        <span> : </span>
        <v-btn>
          {{ second == null ? "--" : pad(second) }}
        </v-btn>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { pad } from "@/utils/helpers";

const props = defineProps<{
  disabled?: boolean;
  hour?: number | null;
  minute?: number | null;
  second?: number | null;
  readonly?: boolean;
  useSeconds?: boolean;
}>();
</script>

<style scoped lang="sass">
@import "./variables.scss"

.v-time-picker-title
  color: $time-picker-title-color
  display: flex
  line-height: 1
  justify-content: flex-end

.v-time-picker-title__time
  white-space: nowrap
  direction: ltr

  .v-picker__title__btn,
  span
    align-items: center
    display: inline-flex
    height: $time-picker-title-btn-height
    font-size: $time-picker-title-btn-height
    justify-content: center

.v-time-picker-title__ampm
  align-self: flex-end
  display: flex
  flex-direction: column
  font-size: $time-picker-ampm-title-font-size
  text-transform: uppercase

  div:only-child
    flex-direction: row

  &--readonly
    .v-picker__title__btn.v-picker__title__btn--active
      opacity: $picker-inactive-btn-opacity

.v-picker__title--landscape
  .v-time-picker-title
    flex-direction: column
    justify-content: center
    height: 100%

  .v-time-picker-title__time
    text-align: right

    .v-picker__title__btn,
    span
      height: $time-picker-landscape-title-btn-height
      font-size: $time-picker-landscape-title-btn-height

  .v-time-picker-title__ampm
    margin: $time-picker-landscape-ampm-title-margin
    align-self: initial
    text-align: center

.v-picker--time .v-picker__title--landscape
  padding: 0

  .v-time-picker-title__time
    text-align: center
</style>
