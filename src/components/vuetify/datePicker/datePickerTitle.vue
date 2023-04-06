<template>
  <div class="v-date-picker-title" :class="classes">
    <div class="v-picker__title__btn v-date-picker-title__year">
      {{ props.year }}
      <v-icon v-if="yearIcon">
        {{ yearIcon }}
      </v-icon>
    </div>
    <div class="v-picker__title__btn v-date-picker-title__date">
      <transition :class="computedTransition">
        <div>
          {{ date || "&nbsp;" }}
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
}>();

const state = reactive({
  isReversing: false,
});

const computedTransition = computed(() =>
  state.isReversing ? "picker-reverse-transition" : "picker-transition"
);

const classes = computed(() => ({
  "v-date-picker-title--disabled": props.disabled,
}));
</script>

<style lang="sass" scoped>
@import './variables.scss'

.v-date-picker-title
  display: flex
  justify-content: space-between
  flex-direction: column
  flex-wrap: wrap
  line-height: 1

  .v-picker__title__btn
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
</style>
