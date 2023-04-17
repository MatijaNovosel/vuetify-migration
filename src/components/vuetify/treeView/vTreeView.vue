<template>
  <div class="v-treeview">Hello</div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { filterTreeItem, filterTreeItems } from "./helper";
import { NodeCache, NodeState, TreeViewProps } from "./models";

const props = defineProps<TreeViewProps>();

const state = reactive({
  level: -1,
  activeCache: new Set() as NodeCache,
  nodes: {} as Record<string | number, NodeState>,
  openCache: new Set() as NodeCache,
  selectedCache: new Set() as NodeCache,
});

const excludedItems = computed(() => {
  const excluded = new Set<string | number>();
  if (!props.search) return excluded;
  for (let i = 0; i < props.items.length; i++) {
    filterTreeItems(
      props.filter || filterTreeItem,
      props.items[i],
      props.search,
      props.itemKey,
      props.itemText,
      props.itemChildren,
      excluded
    );
  }
  return excluded;
});

const classes = computed(() => ({
  "v-treeview--hoverable": props.hoverable,
  "v-treeview--dense": props.dense,
}));
</script>
