<template>
  <div>Hello</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  disabled?: boolean;
  hour?: number | null;
  minute?: number | null;
  second?: number | null;
  readonly?: boolean;
  useSeconds?: boolean;
}>();
</script>
