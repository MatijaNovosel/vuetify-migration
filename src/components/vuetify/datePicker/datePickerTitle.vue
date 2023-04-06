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
  date: string;
  disabled: boolean;
  readonly: boolean;
  selectingYear: boolean;
  value: string;
  year: number | string;
  yearIcon: string;
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
