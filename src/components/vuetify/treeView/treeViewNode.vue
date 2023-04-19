<template>
  <div
    :aria-expanded="isOpen"
    :class="classes"
    class="v-treeview-node v-treeview-node--click"
  >
    <div class="v-treeview-node__root" @click="openNode">
      <div class="v-treeview-node__content">
        <div class="v-treeview-node__level" v-for="l in level" :key="l" />
        <v-btn
          v-if="hasChildren"
          size="35"
          variant="flat"
          class="v-treeview-node__toggle"
          :icon="isOpen ? 'mdi-chevron-down' : 'mdi-chevron-right'"
        />
        <div class="v-treeview-node__level" v-else />
        <v-checkbox-btn
          :true-icon="
            item.children
              ? isIndeterminate
                ? 'mdi-minus-box'
                : 'mdi-checkbox-marked'
              : 'mdi-checkbox-marked'
          "
          density="compact"
          hide-details
          readonly
          :color="color"
          :model-value="isSelected"
          @click.stop="selectNode"
        />
        <div class="v-treeview-node__prepend">
          <slot name="prepend" />
        </div>
        <div class="v-treeview-node__label">
          <template v-if="item.name">
            {{ item.name }}
          </template>
          <slot name="label" v-else />
        </div>
        <div class="v-treeview-node__append">
          <slot name="append" />
        </div>
      </div>
    </div>
    <v-expand-transition>
      <div class="v-treeview-node__children" v-if="openedNodes?.has(item.id)">
        <tree-view-node
          v-for="child in item.children"
          :level="level + 1"
          :key="child.id"
          :item="child"
          :color="color"
        />
      </div>
    </v-expand-transition>
  </div>
</template>

<script lang="ts" setup>
import { useEventBus } from "@vueuse/core";
import { computed, inject } from "vue";
import { findNode } from "./helper";
import { TreeViewNodeItem } from "./models";
import "./treeView.sass";

const { emit: emitNodeSelect } = useEventBus<number>("select-node");
const { emit: emitNodeOpen } = useEventBus<number>("open-node");

const selectedNodes = inject<Set<number>>("selected-nodes");
const openedNodes = inject<Set<number>>("opened-nodes");
const nodes = inject<TreeViewNodeItem[]>("nodes");

const props = defineProps<{
  level: number;
  item: TreeViewNodeItem;
  parentIsDisabled?: boolean;
  color?: string;
}>();

const checkAllChildrenSelected = (
  currentNode: TreeViewNodeItem,
  status: boolean
): boolean => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      if (child.children) {
        return (
          selectedNodes!.has(child.id) &&
          checkAllChildrenSelected(child, status)
        );
      }
    }
  }
  return selectedNodes!.has(currentNode.id);
};

const classes = computed(() => ({
  "v-treeview-node--leaf": !hasChildren.value,
}));

const isOpen = computed(() => openedNodes?.has(props.item.id));

const isSelected = computed(() => selectedNodes?.has(props.item.id));

const isIndeterminate = computed(() => {
  for (const node of nodes!) {
    const n = findNode(props.item.id, node);
    if (n) {
      const allSelected = checkAllChildrenSelected(n, true);
      console.log(allSelected, props.item.id);
      return allSelected;
    }
  }
  return false;
});

const computedIcon = computed(() => {
  if (isIndeterminate.value) return "mdi-account";
  else if (isSelected.value) return "mdi-account";
  else return "mdi-account";
});

const hasChildren = computed(
  () => !!props.item.children && !!props.item.children.length
);

const selectNode = () => {
  emitNodeSelect(props.item.id);
};

const openNode = () => {
  if (!!props.item.children?.length && !!props.item.children.length) {
    emitNodeOpen(props.item.id);
  }
};
</script>
