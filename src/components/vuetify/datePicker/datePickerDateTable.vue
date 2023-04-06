<template>
  <div class="v-date-picker-table v-date-picker-table--date"></div>
</template>

<script lang="ts" setup>
import { DatePickerFormatter } from "./models";

const props = defineProps<{
  showWeek?: boolean;
  localeFirstDayOfYear?: string | number;
  firstDayOfWeek?: string | number;
  showAdjacentMonths?: boolean;
  weekdayFormat?: DatePickerFormatter | undefined;
}>();
</script>

<style lang="sass" scoped>
@import "./variables.scss"

.v-date-picker-table
  position: relative
  padding: $date-picker-table-padding
  height: $date-picker-table-height

  table
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
    top: 0
    table-layout: fixed
    width: 100%

  td, th
    text-align: center
    position: relative

  th
    font-size: $date-picker-table-font-size

  &--date .v-btn
    height: $date-picker-table-date-button-height
    width: $date-picker-table-date-button-width

  .v-btn
    z-index: auto
    margin: 0
    font-size: $date-picker-table-font-size

    &.v-btn--active
      color: $date-picker-table-active-date-color

.v-date-picker-table--month
  td
    width: 33.333333%
    height: $date-picker-table-month-height
    vertical-align: middle
    text-align: center

    .v-btn
      margin: 0 auto
      max-width: $date-picker-table-month-max-width
      min-width: $date-picker-table-month-min-width
      width: 100%

.v-date-picker-table--date
  th
    padding: $date-picker-table-date-padding
    font-weight: $date-picker-table-date-font-weight

  td
    width: $date-picker-table-date-width

.v-date-picker-table__events
  height: $date-picker-event-size
  left: 0
  position: absolute
  text-align: center
  white-space: pre
  width: 100%

  > div
    border-radius: $date-picker-event-border-radius
    display: inline-block
    height: $date-picker-event-size
    margin: $date-picker-event-margin
    width: $date-picker-event-size

.v-date-picker-table--date .v-date-picker-table__events
  bottom: $date-picker-event-month-bottom

.v-date-picker-table--month .v-date-picker-table__events
  bottom: $date-picker-event-date-bottom

.v-date-picker-table__current .v-date-picker-table__events
  margin-bottom: -1px

.v-date-picker-table--disabled
  pointer-events: none
</style>
