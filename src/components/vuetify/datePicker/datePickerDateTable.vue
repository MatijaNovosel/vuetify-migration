<template>
  <div class="v-date-picker-table v-date-picker-table--date">
    <table>
      <thead>
        <th v-for="(d, i) in weekDays" :key="i">
          <tr>
            {{
              d
            }}
          </tr>
        </th>
      </thead>
      <tbody>
        <tr></tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { createRange } from "@/utils/helpers";
import { computed } from "vue";
import { createNativeLocaleFormatter } from "./helpers";
import { DatePickerAllowedDatesFunction, DatePickerFormatter } from "./models";

const props = defineProps<{
  showWeek?: boolean;
  localeFirstDayOfYear?: string | number;
  firstDayOfWeek?: string | number;
  showAdjacentMonths?: boolean;
  weekdayFormat?: DatePickerFormatter | undefined;
  allowedDates?: DatePickerAllowedDatesFunction;
  current?: string;
  disabled?: boolean;
  format?: DatePickerFormatter;
  events?: any[] | Function | Object;
  eventColor?: any[] | Function | Object | string;
  min?: string;
  max?: string;
  range?: boolean;
  readonly?: boolean;
  scrollable?: boolean;
  tableDate: string;
  value?: string | string[];
  currentLocale?: string;
}>();

const formatter = computed(() => {
  return (
    props.format ||
    createNativeLocaleFormatter(
      props.currentLocale,
      { day: "numeric", timeZone: "UTC" },
      { start: 8, length: 2 }
    )
  );
});

const weekdayFormatter = computed(
  () =>
    props.weekdayFormat ||
    createNativeLocaleFormatter(props.currentLocale, {
      weekday: "narrow",
      timeZone: "UTC",
    })
);

const weekDays = computed(() => {
  const first = parseInt((props.firstDayOfWeek || 0).toString(), 10);
  return weekdayFormatter.value
    ? createRange(7).map((i) =>
        weekdayFormatter.value!(`2017-01-${first + i + 15}`)
      ) // 2017-01-15 is Sunday
    : createRange(7).map(
        (i) => ["S", "M", "T", "W", "T", "F", "S"][(i + first) % 7]
      );
});
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
