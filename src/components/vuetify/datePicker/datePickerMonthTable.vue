<template>
  <table class="v-date-picker-table v-date-picker-table--month">
    <tbody>
      <tr v-for="(r, i) in rows" :key="i">
        <td v-for="(d, j) in r" :key="j">
          <v-btn
            class="v-date-picker-table__current"
            variant="text"
            :class="{
              [`bg-${color || 'accent'}`]: isSelected(d),
            }"
          >
            {{ formatter!(d) }}
          </v-btn>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { pad } from "@/utils/helpers";
import { computed } from "vue";
import { createNativeLocaleFormatter } from "./helpers";

const props = defineProps<{
  disabled?: boolean;
  readonly?: boolean;
  tableDate: string;
  value?: string | string[];
  range?: boolean;
  currentLocale?: string;
  color?: string;
}>();

const formatter = computed(() =>
  createNativeLocaleFormatter(
    props.currentLocale,
    { month: "short", timeZone: "UTC" },
    { start: 5, length: 2 }
  )
);

const displayedYear = computed(() => Number(props.tableDate.split("-")[0]));

const isSelected = (value: string) => {
  if (Array.isArray(props.value)) {
    if (props.range && props.value.length === 2) {
      const [from, to] = [...props.value].sort();
      return from <= value && value <= to;
    } else {
      return props.value.indexOf(value) !== -1;
    }
  }
  return value === props.value;
};

const rows = computed(() => {
  const res = [];
  const cols = Array(3).fill(null);
  const rows = 12 / cols.length;

  for (let row = 0; row < rows; row++) {
    const tds = cols.map((_, col) => {
      const month = row * cols.length + col;
      const date = `${displayedYear.value}-${pad(month + 1)}`;
      return date;
    });
    res.push(tds);
  }

  return res;
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
    color: rgba(0,0,0,.38)

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
