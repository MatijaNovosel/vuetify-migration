<template>
  <div class="v-treeview" :class="classes">
    <tree-view-node
      :level="1"
      :item="item"
      v-for="item in state.items"
      :key="item.id"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { filterTreeItem, filterTreeItems } from "./helper";
import { TreeViewNodeCacheItem, TreeViewNodeItem } from "./models";
import "./treeView.sass";
import treeViewNode from "./treeViewNode.vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps<{
  dense?: boolean;
  disabled?: boolean;
  filter?: () => void;
  hoverable?: boolean;
  items: TreeViewNodeItem[];
  search?: string;
  modelValue: number[];
}>();

const state = reactive({
  items: props.items.map((n) => ({
    ...n,
    isOpen: false,
  })) as TreeViewNodeCacheItem[],
});

const excludedItems = computed(() => {
  const excluded = new Set<string | number>();
  if (!props.search) return excluded;
  for (let i = 0; i < props.items.length; i++) {
    filterTreeItems(
      props.filter || filterTreeItem,
      props.items[i],
      props.search,
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
