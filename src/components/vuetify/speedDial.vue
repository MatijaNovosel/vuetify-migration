<template>
  <div
    @click="state.isActive = !state.isActive"
    ref="speedDial"
    class="pa-5 bg-blue rounded-lg"
    :class="classes"
    @mouseenter="openOnHover ? mouseEnter : null"
    @mouseleave="openOnHover ? mouseLeave : null"
  >
    {{ state.isActive ? "Active" : "Inactive" }}
    <slot name="activator" />
    <transition-group
      tag="div"
      class="v-speed-dial__list"
      :transition="transition || 'scale-transition'"
    >
      <div class="bg-red" v-for="(s, i) in slots.default" :key="i">
        {{ s }}
      </div>
    </transition-group>
    {{ slots }}
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { computed, reactive, ref, useSlots } from "vue";

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

const slots = useSlots();

const speedDial = ref(null);

const state = reactive({
  isActive: false,
});

const mouseEnter = () => {
  state.isActive = true;
};

const mouseLeave = () => {
  state.isActive = false;
};

onClickOutside(speedDial, () => (state.isActive = false));

const classes = computed(() => ({
  "v-speed-dial": true,
  "v-speed-dial--top": props.top,
  "v-speed-dial--right": props.right,
  "v-speed-dial--bottom": props.bottom,
  "v-speed-dial--left": props.left,
  "v-speed-dial--absolute": props.absolute,
  "v-speed-dial--fixed": props.fixed,
  [`v-speed-dial--direction-${props.direction}`]: true,
  "v-speed-dial--is-active": state.isActive,
}));
</script>

<style lang="scss" scoped>
$speed-dial-padding: 16px !default;
$speed-dial-button-margin: 6px !default;
$speed-dial-z-index: 1 !default;
$spacer: 4px !default;
$grid-gutter: $spacer * 6 !default;
$grid-gutters: (
  "xs": calc($grid-gutter / 12),
  "sm": calc($grid-gutter / 6),
  "md": calc($grid-gutter / 3),
  "lg": calc($grid-gutter * 2 / 3),
  "xl": $grid-gutter,
);

.v-speed-dial {
  position: relative;
  z-index: $speed-dial-z-index;

  &--absolute {
    position: absolute;
  }

  &--fixed {
    position: fixed;
  }

  &--fixed,
  &--absolute {
    z-index: 4;
    & > .v-btn--floating {
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
      .v-speed-dial__list {
        height: 100%;
        top: 0;
        padding: 0 $speed-dial-padding;
      }
    }
    &-top,
    &-bottom {
      .v-speed-dial__list {
        left: 0;
        width: 100%;
      }
    }
    &-top {
      .v-speed-dial__list {
        flex-direction: column-reverse;
        bottom: 100%;
      }
    }
    &-right {
      .v-speed-dial__list {
        flex-direction: row;
        left: 100%;
      }
    }
    &-bottom {
      .v-speed-dial__list {
        flex-direction: column;
        top: 100%;
      }
    }
    &-left {
      .v-speed-dial__list {
        flex-direction: row-reverse;
        right: 100%;
      }
    }
  }
}

.v-speed-dial__list {
  align-items: center;
  display: flex;
  justify-content: center;
  padding: $speed-dial-padding 0;
  position: absolute;

  .v-btn {
    margin: $speed-dial-button-margin;
  }
}

.v-speed-dial:not(.v-speed-dial--is-active) .v-speed-dial__list {
  pointer-events: none;
}
</style>
