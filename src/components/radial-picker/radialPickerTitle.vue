<template>
  <div class="picker__title" :class="classes">
    <div class="radial-picker-title">
      <div class="radial-picker-title__time">
        <div
          @click="emit('update:selecting', SelectingTimes.Hour)"
          class="picker__title__btn"
          :class="{
            'picker__title__btn--active': SelectingTimes.Hour === selecting,
          }"
        >
          {{ hour == null ? "--" : hour.toString().padStart(2, "0") }}
        </div>
        <span> : </span>
        <div
          @click="emit('update:selecting', SelectingTimes.Minute)"
          class="picker__title__btn"
          :class="{
            'picker__title__btn--active': SelectingTimes.Minute === selecting,
          }"
        >
          {{ minute == null ? "--" : minute.toString().padStart(2, "0") }}
        </div>
        <template v-if="useSeconds">
          <span> : </span>
          <div
            @click="emit('update:selecting', SelectingTimes.Second)"
            class="picker__title__btn"
            :class="{
              'picker__title__btn--active':
                SelectingTimes.Second === selecting,
            }"
          >
            {{ second == null ? "--" : second.toString().padStart(2, "0") }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { SelectingTimes } from "./constants";

const emit = defineEmits<{
  (e: "update:selecting", type: SelectingTimes): void;
}>();

const props = defineProps<{
  disabled?: boolean;
  hour?: number | null;
  minute?: number | null;
  second?: number | null;
  readonly?: boolean;
  useSeconds?: boolean;
  color?: string;r
  selecting: SelectingTimes;
}>();

const classes = computed(() => ({
  // TODO: Treba handlati druge načine predaje boja osim vuetify klasa, npr. hex
  [`bg-${props.color}` || "bg-accent"]: true,
}));
</script>

<style scoped lang="sass">
@import "./variables.scss"

.picker
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

      &:not(.picker__title__btn--active)
        opacity: $picker-inactive-btn-opacity
        cursor: pointer

        &:hover:not(:focus)
          opacity: 1

.radial-picker-title
  color: $radial-picker-title-color
  display: flex
  line-height: 1
  justify-content: flex-end

.radial-picker-title__time
  white-space: nowrap
  direction: ltr

  .picker__title__btn,
  span
    align-items: center
    display: inline-flex
    height: $radial-picker-title-btn-height
    font-size: $radial-picker-title-btn-height
    justify-content: center

.picker--time
  padding: 0

  .radial-picker-title__time
    text-align: center
</style>
