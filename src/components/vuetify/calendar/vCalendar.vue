<template>
  <div class="v-calendar">
    <calendar-monthly />
  </div>
</template>

<script lang="ts" setup>
import calendarMonthly from "./calendarMonthly.vue";
import {
  CalendarCategory,
  CalendarCategoryTextFunction,
  CalendarFormatter,
  CalendarTimestamp,
} from "./models";

const props = defineProps<{
  type: string;
  value: string | number | Date;
  // Weeks
  localeFirstDayOfYear?: string | number;
  minWeeks?: number;
  shortMonths?: boolean;
  showMonthOnFirst?: boolean;
  showWeek?: boolean;
  monthFormat?: CalendarFormatter;
  // Intervals
  maxDays?: number;
  shortIntervals?: boolean;
  intervalHeight?: number | string;
  intervalWidth?: number | string;
  intervalMinutes?: number | string;
  firstInterval?: number | string;
  firstTime?: number | string | Object;
  intervalCount?: number | string;
  intervalFormat?: CalendarFormatter;
  intervalStyle?: (interval: CalendarTimestamp) => Object;
  showIntervalLabel?: (interval: CalendarTimestamp) => boolean;
  // Category
  categories?: CalendarCategory[] | string;
  categoryText: string | CalendarCategoryTextFunction;
  categoryHideDynamic: boolean;
  categoryShowAll: boolean;
  categoryForInvalid: string;
  categoryDays: number | string;
}>();
</script>
