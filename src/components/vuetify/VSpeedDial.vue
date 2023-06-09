<template>
  <div :class="classes" ref="speedDial">
    <slot name="activator" :activate="toggle" />
    <transition-group
      @click="toggle"
      tag="div"
      name="scale-transition"
      class="speed-dial__list"
    >
      <slot v-if="state.active" />
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { computed, reactive, ref } from "vue";

const props = defineProps<{
  direction?: "top" | "right" | "bottom" | "left";
  openOnHover?: boolean;
  transition?: string;
  absolute?: boolean;
  bottom?: boolean;
  fixed?: boolean;
  left?: boolean;
  right?: boolean;
  top?: boolean;
  mode?: string;
  origin?: string;
}>();

const speedDial = ref(null);

onClickOutside(speedDial, () => (state.active = false));

const toggle = () => (state.active = !state.active);

const state = reactive({
  active: false,
});

const classes = computed(() => ({
  "speed-dial": true,
  "speed-dial--top": props.top,
  "speed-dial--right": props.right,
  "speed-dial--bottom": props.bottom,
  "speed-dial--left": props.left,
  "speed-dial--absolute": props.absolute,
  "speed-dial--fixed": props.fixed,
  [`speed-dial--direction-${props.direction}`]: true,
  "speed-dial--is-active": state.active,
}));
</script>

<style lang="scss" scoped>
$speed-dial-padding: 16px;
$grid-gutter: 24px;
$grid-gutters: (
  "xs": calc($grid-gutter / 12),
  "sm": calc($grid-gutter / 6),
  "md": calc($grid-gutter / 3),
  "lg": calc($grid-gutter * 2 / 3),
  "xl": $grid-gutter,
);

.speed-dial {
  position: relative;
  z-index: 1;

  &--absolute {
    position: absolute;
  }

  &--fixed {
    position: fixed;
  }

  &--fixed,
  &--absolute {
    z-index: 4;
    & > .btn--floating {
      margin: 0;
    }
  }

  &--top {
    top: map-get($grid-gutters, "lg");
  }

  &--bottom {
    bottom: map-get($grid-gutters, "lg");
  }

  &--left {
    left: map-get($grid-gutters, "lg");
  }

  &--right {
    right: map-get($grid-gutters, "lg");
  }

  &--direction {
    &-left,
    &-right {
      .speed-dial__list {
        height: 100%;
        top: 0;
        padding: 0 $speed-dial-padding;
      }
    }
    &-top,
    &-bottom {
      .speed-dial__list {
        left: 0;
        width: 100%;
      }
    }
    &-top {
      .speed-dial__list {
        flex-direction: column-reverse;
        bottom: 100%;
      }
    }
    &-right {
      .speed-dial__list {
        flex-direction: row;
        left: 100%;
      }
    }
    &-bottom {
      .speed-dial__list {
        flex-direction: column;
        top: 100%;
      }
    }
    &-left {
      .speed-dial__list {
        flex-direction: row-reverse;
        right: 100%;
      }
    }
  }
}

.speed-dial__list {
  align-items: center;
  display: flex;
  justify-content: center;
  padding: $speed-dial-padding 0;
  position: absolute;
}

.speed-dial:not(.speed-dial--is-active) .speed-dial__list {
  pointer-events: none;
}
</style>
