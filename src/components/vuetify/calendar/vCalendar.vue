<template>
  <div>Hello</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  type: string;
  value: string | number | Date;
}>();
</script>
