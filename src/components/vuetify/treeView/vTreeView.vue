<template>
  <div class="v-treeview" :class="classes">
    <tree-view-node
      v-for="item in items"
      :color="props.color || 'accent'"
      :level="1"
      :item="item"
      :key="item.id"
    />
  </div>
</template>

<script lang="ts" setup>
import { useEventBus } from "@vueuse/core";
import { computed, onUnmounted, provide, reactive, watch } from "vue";
import { findNode } from "./helper";
import { TreeViewNodeItem, TreeViewSelectionMode } from "./models";
import "./treeView.sass";
import treeViewNode from "./treeViewNode.vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps<{
  dense?: boolean;
  disabled?: boolean;
  filter?: () => void;
  hoverable?: boolean;
  search?: string;
  color?: string;
  modelValue: number[];
  items: TreeViewNodeItem[];
  selectionMode: TreeViewSelectionMode;
}>();

const busSelectNode = useEventBus<number>("select-node");
const busOpenNode = useEventBus<number>("open-node");

const unselectNode = (id: number) => {
  state.selectedNodes.delete(id);
};

const selectNode = (id: number) => {
  state.selectedNodes.add(id);
};

const toggleNode = (id: number) => {
  if (state.selectedNodes.has(id)) {
    unselectNode(id);
    return;
  }
  selectNode(id);
};

const applyToAllChildren = (
  currentNode: TreeViewNodeItem,
  fn: (id: number) => void
) => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      fn(child.id);
      if (child.children) applyToAllChildren(child, fn);
    }
  }
};

const handleSelectNode = (id: number) => {
  if (props.selectionMode === "leaf") {
    const isSelectedAlready = state.selectedNodes.has(id);
    toggleNode(id);
    for (const node of props.items) {
      const n = findNode(id, node);
      if (n) {
        applyToAllChildren(n, isSelectedAlready ? unselectNode : selectNode);
        break;
      }
    }
  } else {
    toggleNode(id);
  }
};

const openNode = (id: number) => {
  if (state.openedNodes.has(id)) {
    state.openedNodes.delete(id);
    return;
  }
  state.openedNodes.add(id);
};

const unsubscribeSelectedNode = busSelectNode.on(handleSelectNode);
const unsubscribeOpenNode = busOpenNode.on(openNode);

const state = reactive({
  selectedNodes: new Set<number>(),
  openedNodes: new Set<number>(),
});

provide("selected-nodes", state.selectedNodes);
provide("opened-nodes", state.openedNodes);
provide("nodes", props.items);

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
