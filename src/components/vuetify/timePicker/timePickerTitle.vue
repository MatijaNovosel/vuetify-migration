<template>
  <div class="v-picker__title" :class="classes">
    <div class="v-time-picker-title">
      <div class="v-time-picker-title__time">
        <div class="v-picker__title__btn">
          {{ hour == null ? "--" : pad(hour) }}
        </div>
        <span> : </span>
        <div class="v-picker__title__btn">
          {{ minute == null ? "--" : pad(minute) }}
        </div>
        <template v-if="useSeconds">
          <span> : </span>
          <div class="v-picker__title__btn">
            {{ second == null ? "--" : pad(second) }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { pad } from "@/utils/helpers";
import { computed } from "vue";

const props = defineProps<{
  disabled?: boolean;
  hour?: number | null;
  minute?: number | null;
  second?: number | null;
  readonly?: boolean;
  useSeconds?: boolean;
  color?: string;
}>();

const classes = computed(() => ({
  // TODO: Treba handlati druge načine predaje boja osim vuetify klasa, npr. hex
  [`bg-${props.color}` || "bg-accent"]: true,
}));
</script>

<style scoped lang="sass">
@import "./variables.scss"

.v-picker
  border-radius: $picker-border-radius
  contain: layout style
  display: inline-flex
  flex-direction: column
  font-size: $picker-font-size
  vertical-align: top
  position: relative

  &__title
    color: white
    border-top-left-radius: $picker-border-radius
    border-top-right-radius: $picker-border-radius
    padding: $picker-title-padding

    &__btn
      transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)

      &:not(.v-picker__title__btn--active)
        opacity: $picker-inactive-btn-opacity
        cursor: pointer

        &:hover:not(:focus)
          opacity: 1

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

.v-picker--time
  padding: 0

  .v-time-picker-title__time
    text-align: center
</style>
