<template>
  <div class="bg-blue pa-4">Hello</div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { NodeCache, NodeState } from "./models";

const state = reactive({
  level: -1,
  activeCache: new Set() as NodeCache,
  nodes: {} as Record<string | number, NodeState>,
  openCache: new Set() as NodeCache,
  selectedCache: new Set() as NodeCache,
});
</script>
