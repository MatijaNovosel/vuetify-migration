<template>
  <div class="v-date-picker-title v-picker__title" :class="classes">
    <div class="v-picker__title__btn v-date-picker-title__year">
      {{ year }}
      <v-icon v-if="yearIcon">
        {{ yearIcon }}
      </v-icon>
    </div>
    <div
      class="v-picker__title__btn v-date-picker-title__date v-picker__title__btn--active"
    >
      <transition
        :name="
          state.isReversing ? 'picker-reverse-transition' : 'picker-transition'
        "
      >
        <div>
          {{ date }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";

const props = defineProps<{
  date?: string;
  disabled?: boolean;
  readonly?: boolean;
  selectingYear?: boolean;
  value?: string;
  year?: number | string;
  yearIcon?: string;
  color?: string;
}>();

const state = reactive({
  isReversing: false,
});

const classes = computed(() => ({
  "v-date-picker-title--disabled": props.disabled,
  // TODO: Treba handlati druge načine predaje boja osim vuetify klasa, npr. hex
  [`bg-${props.color}` || "bg-accent"]: true,
}));
</script>

<style lang="sass" scoped>
@import './variables.scss'
@import './transitions.scss'

.v-date-picker-title
  display: flex
  justify-content: space-between
  flex-direction: column
  flex-wrap: wrap
  line-height: 1

  &__year
    align-items: center
    display: inline-flex
    font-size: $date-picker-title-year-font-size
    font-weight: $date-picker-title-year-font-weight
    margin-bottom: $date-picker-title-year-bottom-margin

  &__date
    font-size: $date-picker-title-date-font-size
    text-align: left
    font-weight: $date-picker-title-date-font-weight
    position: relative
    overflow: hidden
    padding-bottom: 8px
    margin-bottom: -8px

    > div
      position: relative

  &--disabled
    pointer-events: none

.v-picker
  border-radius: $picker-border-radius
  contain: layout style
  display: inline-flex
  flex-direction: column
  font-size: $picker-font-size
  vertical-align: top
  position: relative

.v-picker--full-width
  display: flex
  width: 100%

  > .v-picker__body
    margin: initial

.v-picker__title
  color: white
  border-top-left-radius: $picker-border-radius
  border-top-right-radius: $picker-border-radius
  padding: $picker-title-padding

.v-picker__title__btn
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)

  &:not(.v-picker__title__btn--active)
    opacity: $picker-inactive-btn-opacity
    cursor: pointer

    &:hover:not(:focus)
      opacity: 1

.v-picker__title__btn--readonly
  pointer-events: none


.v-picker__title__btn--active
    opacity: $picker-active-btn-opacity

.v-picker__body
  height: auto
  overflow: hidden
  position: relative
  z-index: 0

  flex: 1 0 auto
  display: flex
  flex-direction: column
  align-items: center
  margin: 0 auto

  > div
    width: 100%

    &.fade-transition-leave-active
      position: absolute

.v-picker--landscape
  .v-picker__title
    border-top-right-radius: 0
    border-bottom-right-radius: 0
    width: $picker-landscape-title-width
    position: absolute
    top: 0
    height: 100%
    z-index: 1
</style>
