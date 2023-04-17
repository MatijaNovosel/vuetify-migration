<template>
  <div class="v-calendar-weekly">
    <div class="v-calendar-weekly__head"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import {
  createDayList,
  getEndOfWeek,
  getStartOfWeek,
  getWeekdaySkips,
  parseTimestamp,
} from "./helpers";
import { CalendarTimestamp } from "./models";

const props = defineProps<{
  weekdays: number[];
}>();

const state = reactive({
  times: {
    now: parseTimestamp("0000-00-00 00:00", true),
    today: parseTimestamp("0000-00-00", true),
  },
});

const weekdaySkips = computed(() => getWeekdaySkips(props.weekdays));

const todayWeek = computed(() => {
  const today = state.times.today as CalendarTimestamp;
  const start = getStartOfWeek(today, props.weekdays, today);
  const end = getEndOfWeek(today, props.weekdays, today);

  return createDayList(
    start,
    end,
    today,
    weekdaySkips.value,
    props.weekdays.length,
    props.weekdays.length
  );
});
</script>
