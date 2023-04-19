<template>
  <div class="v-treeview" :class="classes">
    <tree-view-node
      :color="props.color || 'accent'"
      :level="1"
      :item="item"
      v-for="item in items"
      :key="item.id"
    />
  </div>
</template>

<script lang="ts" setup>
import { useEventBus } from "@vueuse/core";
import { computed, onUnmounted, provide, reactive, watch } from "vue";
import { filterTreeItem, filterTreeItems } from "./helper";
import { TreeViewNodeItem } from "./models";
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
  color?: string;
  modelValue: number[];
}>();

const busSelectNode = useEventBus<number>("select-node");
const busOpenNode = useEventBus<number>("open-node");

const selectNode = (id: number) => {
  if (state.selectedNodes.has(id)) {
    state.selectedNodes.delete(id);
    return;
  }
  state.selectedNodes.add(id);
};

const openNode = (id: number) => {
  if (state.openedNodes.has(id)) {
    state.openedNodes.delete(id);
    return;
  }
  state.openedNodes.add(id);
};

const unsubscribeSelectedNode = busSelectNode.on(selectNode);
const unsubscribeOpenNode = busOpenNode.on(openNode);

const state = reactive({
  selectedNodes: new Set<number>(),
  openedNodes: new Set<number>(),
});

provide("selected-nodes", state.selectedNodes);
provide("opened-nodes", state.openedNodes);

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

watch(
  () => state.selectedNodes,
  (val) => emit("update:modelValue", [...val]),
  {
    deep: true,
  }
);

onUnmounted(() => {
  unsubscribeSelectedNode();
  unsubscribeOpenNode();
});
</script>
