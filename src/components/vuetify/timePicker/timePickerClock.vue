<template>
  <div class="v-picker__body">
    <div class="v-time-picker-clock__container">
      <div
        class="v-time-picker-clock bg-grey-lighten-3"
        :class="{
          'v-time-picker-clock--indeterminate': value == null,
        }"
      >
        <div class="v-time-picker-clock__inner">
          <div
            class="v-time-picker-clock__hand"
            :style="clockHandStyle"
            :class="{
              'v-time-picker-clock__hand--inner': isInner(value),
            }"
          />
          <span
            v-for="v in values"
            :key="v"
            class="v-time-picker-clock__item"
            :class="{
              'v-time-picker-clock__item--active': v === displayedValue,
            }"
            :style="getTransform(v)"
          >
            <span>
              {{ pad(v, 2) }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { pad } from "@/utils/helpers";
import { computed, reactive, watch } from "vue";

const props = defineProps<{
  disabled?: boolean;
  double?: boolean;
  readonly?: boolean;
  value: number | null;
  min: number;
  max: number;
  step: number;
}>();

const state = reactive({
  inputValue: props.value,
  isDragging: false,
  valueOnMouseDown: null as number | null,
  valueOnMouseUp: null as number | null,
});

const values = computed(() => {
  const res = [];

  for (let value = props.min; value <= props.max; value = value + props.step) {
    res.push(value);
  }

  return res;
});

const clockHandStyle = computed(() => ({
  transform: `rotate(${
    degreesPerUnit.value * (displayedValue.value - props.min)
  }deg) scaleY(${handScale(displayedValue.value)})}`,
}));

const count = computed(() => {
  return props.max - props.min + 1;
});

const degreesPerUnit = computed(() => {
  return 360 / roundCount.value;
});

const degrees = computed(() => {
  return (degreesPerUnit.value * Math.PI) / 180;
});

const displayedValue = computed(() => {
  return props.value == null ? props.min : props.value;
});

const innerRadiusScale = computed(() => {
  return 0.62;
});

const roundCount = computed(() => {
  return props.double ? count.value / 2 : count.value;
});

const isInner = (value: number | null) => {
  if (value) {
    return props.double && value - props.min >= roundCount.value;
  }
  return false;
};

const handScale = (value: number) => {
  return isInner(value) ? innerRadiusScale.value : 1;
};

const getPosition = (value: number) => {
  const rotateRadians = Math.PI / 180;
  return {
    x:
      Math.sin((value - props.min) * degrees.value + rotateRadians) *
      handScale(value),
    y:
      -Math.cos((value - props.min) * degrees.value + rotateRadians) *
      handScale(value),
  };
};

const getTransform = (i: number) => {
  const { x, y } = getPosition(i);
  return {
    left: `${50 + x * 50}%`,
    top: `${50 + y * 50}%`,
  };
};

watch(
  () => props.value,
  (val) => {
    state.inputValue = val;
  }
);
</script>

<style lang="sass" scoped>
@import "./variables.scss"

.v-time-picker-clock
  border-radius: 100%
  position: relative
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
  user-select: none
  width: 100%
  padding-top: 100%
  flex: 1 0 auto

  &__item--disabled
    color: pink

    &.v-time-picker-clock__item--active
      color: purple

  &--indeterminate
    .v-time-picker-clock__hand
      background-color: #bdbdbd

    &:after
      color: yellow

    .v-time-picker-clock__item--active
      background-color: #bdbdbd

  &__container
    display: flex
    flex-direction: column
    flex-basis: 290px
    justify-content: center
    padding: $time-picker-clock-padding

  &__hand
    height: $time-picker-clock-hand-height
    width: $time-picker-clock-hand-width
    bottom: 50%
    left: $time-picker-clock-hand-left
    transform-origin: center bottom
    position: absolute
    will-change: transform
    z-index: 1

    &:before
      background: transparent
      border-width: $time-picker-clock-end-border-width
      border-style: $time-picker-clock-end-border-style
      border-color: $time-picker-clock-end-border-color
      border-radius: 100%
      width: $time-picker-clock-end-size
      height: $time-picker-clock-end-size
      content: ''
      position: absolute
      top: $time-picker-clock-end-top
      left: 50%
      transform: translate(-50%, -50%)

    &:after
      content: ''
      position: absolute
      height: $time-picker-clock-center-size
      width: $time-picker-clock-center-size
      top: 100%
      left: 50%
      border-radius: 100%
      border-style: solid
      border-color: inherit
      background-color: inherit
      transform: translate(-50%, -50%)

    &--inner:after
      height: $time-picker-clock-inner-hand-height

.v-picker--full-width
  .v-time-picker-clock__container
    max-width: $time-picker-clock-max-width

.v-time-picker-clock__inner
  position: absolute
  bottom: $time-picker-clock-inner-offset
  left: $time-picker-clock-inner-offset
  right: $time-picker-clock-inner-offset
  top: $time-picker-clock-inner-offset

.v-time-picker-clock__item
  align-items: center
  border-radius: 100%
  cursor: default
  display: flex
  font-size: $time-picker-number-font-size
  justify-content: center
  height: $time-picker-indicator-size
  position: absolute
  text-align: center
  width: $time-picker-indicator-size
  user-select: none
  transform: translate(-50%, -50%)

  > span
    z-index: 1

  &:before, &:after
    content: ''
    border-radius: 100%
    position: absolute
    top: 50%
    left: 50%
    height: 14px
    width: 14px
    transform: translate(-50%, -50%)

  &:after, &:before
    height: $time-picker-indicator-size
    width: $time-picker-indicator-size

  &--active
    color: white
    cursor: default
    z-index: 2

  &--disabled
    pointer-events: none
</style>
