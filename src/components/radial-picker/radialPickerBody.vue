<template>
  <div class="picker__body">
    <div class="radial-picker-clock__container">
      <div
        ref="clock"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @mouseleave="(e: MouseEvent) => (state.isDragging && onMouseUp(e))"
        @touchstart="onMouseDown"
        @touchend="onMouseUp"
        @mousemove="onDragMove"
        @touchmove="onDragMove"
        class="radial-picker-clock bg-grey-lighten-3"
        :class="{
          'radial-picker-clock--indeterminate': value == null,
        }"
      >
        <div ref="innerClock" class="radial-picker-clock__inner">
          <div
            class="radial-picker-clock__hand"
            :style="clockHandStyle"
            :class="{
              [`bg-${color || 'accent'}`]: value !== null,
              'radial-picker-clock__hand--inner': isInner(value),
            }"
          />
          <span
            v-for="v in values"
            :key="v"
            class="radial-picker-clock__item"
            :class="{
              'radial-picker-clock__item--active': v === displayedValue,
              [`bg-${color || 'accent'}`]:
                value !== null && v === displayedValue,
            }"
            :style="getTransform(v)"
          >
            <span>
              {{
                selecting === SelectingTimes.Hour
                  ? v
                  : v.toString().padStart(2, "0")
              }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import { SelectingTimes } from "./constants";

interface Point {
  x: number;
  y: number;
}

const emit = defineEmits<{
  (e: "input", value: number): void;
  (e: "change", value: number): void;
}>();

const clock = ref<HTMLElement | null>(null);
const innerClock = ref<HTMLElement | null>(null);

const innerRadiusScale = 0.62;

const props = defineProps<{
  disabled?: boolean;
  readonly?: boolean;
  color?: string;
  value: number | null;
  selecting: number;
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

const count = computed(() => props.max - props.min + 1);

const roundCount = computed(() =>
  selectingHour.value ? count.value / 2 : count.value
);

const degreesPerUnit = computed(() => 360 / roundCount.value);

const degrees = computed(() => (degreesPerUnit.value * Math.PI) / 180);

const selectingHour = computed(() => props.selecting === SelectingTimes.Hour);

const clockHandStyle = computed(() => ({
  transform: `rotate(${
    degreesPerUnit.value * (displayedValue.value - props.min)
  }deg) scaleY(${handScale(displayedValue.value)})`,
}));

const displayedValue = computed(() =>
  props.value == null ? props.min : props.value
);

const isInner = (value: number | null) => {
  if (value)
    return selectingHour.value && value - props.min >= roundCount.value;
  return false;
};

const handScale = (value: number) => (isInner(value) ? innerRadiusScale : 1);

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

const euclidean = (p0: Point, p1: Point) => {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const angle = (center: Point, p1: Point) => {
  const value =
    2 * Math.atan2(p1.y - center.y - euclidean(center, p1), p1.x - center.x);
  return Math.abs((value * 180) / Math.PI);
};

const angleToValue = (angle: number, insideClick: boolean) => {
  const value =
    ((Math.round(angle / degreesPerUnit.value) +
      (insideClick ? roundCount.value : 0)) %
      count.value) +
    props.min;
  // Necessary to fix edge case when selecting left part of the value(s) at 12 o'clock
  if (angle < 360 - degreesPerUnit.value / 2) return value;
  return insideClick ? props.max - roundCount.value + 1 : props.min;
};

const update = (value: number) => {
  if (state.inputValue !== value) {
    state.inputValue = value;
    emit("input", value);
  }
};

const setMouseDownValue = (value: number) => {
  if (state.valueOnMouseDown === null) state.valueOnMouseDown = value;
  state.valueOnMouseUp = value;
  update(value);
};

const onDragMove = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  if ((!state.isDragging && e.type !== "click") || !clock.value) return;
  const { width, top, left } = clock.value.getBoundingClientRect();
  const { width: innerWidth } = innerClock.value!.getBoundingClientRect();
  const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
  const center = { x: width / 2, y: -width / 2 };
  const coords = { x: clientX - left, y: top - clientY };
  const handAngle = Math.round(angle(center, coords) - 0 + 360) % 360;
  const insideClick =
    selectingHour.value &&
    euclidean(center, coords) <
      (innerWidth + innerWidth * innerRadiusScale) / 4;
  const checksCount = Math.ceil(15 / degreesPerUnit.value);
  let value;

  for (let i = 0; i < checksCount; i++) {
    value = angleToValue(handAngle + i * degreesPerUnit.value, insideClick);
    return setMouseDownValue(value);
  }
};

const onMouseDown = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  state.valueOnMouseDown = null;
  state.valueOnMouseUp = null;
  state.isDragging = true;
  onDragMove(e);
};

const onMouseUp = (e: MouseEvent | TouchEvent) => {
  e.stopPropagation();
  state.isDragging = false;
  if (state.valueOnMouseUp !== null) emit("change", state.valueOnMouseUp);
};

watch(
  () => props.value,
  (val) => (state.inputValue = val)
);
</script>

<style lang="sass" scoped>
@import "./variables.scss"

.radial-picker-clock
  border-radius: 100%
  position: relative
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
  user-select: none
  width: 100%
  padding-top: 100%
  flex: 1 0 auto

  &__item--disabled
    color: pink

    &.radial-picker-clock__item--active
      color: purple

  &--indeterminate
    .radial-picker-clock__hand
      background-color: #bdbdbd

    &:after
      color: yellow

    .radial-picker-clock__item--active
      background-color: #bdbdbd

  &__container
    display: flex
    flex-direction: column
    flex-basis: 290px
    justify-content: center
    padding: $radial-picker-clock-padding

  &__hand
    height: $radial-picker-clock-hand-height
    width: $radial-picker-clock-hand-width
    bottom: 50%
    left: $radial-picker-clock-hand-left
    transform-origin: center bottom
    position: absolute
    will-change: transform
    z-index: 1

    &:before
      background: transparent
      border-width: $radial-picker-clock-end-border-width
      border-style: $radial-picker-clock-end-border-style
      border-color: v-bind(color)
      border-radius: 100%
      width: $radial-picker-clock-end-size
      height: $radial-picker-clock-end-size
      content: ''
      position: absolute
      top: $radial-picker-clock-end-top
      left: 50%
      transform: translate(-50%, -50%)

    &:after
      content: ''
      position: absolute
      height: $radial-picker-clock-center-size
      width: $radial-picker-clock-center-size
      top: 100%
      left: 50%
      border-radius: 100%
      border-style: solid
      border-color: v-bind('color')
      background-color: v-bind('color')
      transform: translate(-50%, -50%)

    &--inner:after
      height: $radial-picker-clock-inner-hand-height

.picker--full-width
  .radial-picker-clock__container
    max-width: $radial-picker-clock-max-width

.radial-picker-clock__inner
  position: absolute
  bottom: $radial-picker-clock-inner-offset
  left: $radial-picker-clock-inner-offset
  right: $radial-picker-clock-inner-offset
  top: $radial-picker-clock-inner-offset

.radial-picker-clock__item
  align-items: center
  border-radius: 100%
  cursor: default
  display: flex
  font-size: $radial-picker-number-font-size
  justify-content: center
  height: $radial-picker-indicator-size
  position: absolute
  text-align: center
  width: $radial-picker-indicator-size
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
    height: $radial-picker-indicator-size
    width: $radial-picker-indicator-size

  &--active
    color: white
    cursor: default
    z-index: 2

  &--disabled
    pointer-events: none
</style>
