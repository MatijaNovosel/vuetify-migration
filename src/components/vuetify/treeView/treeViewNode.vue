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
          :true-icon="nodeIcon"
          density="compact"
          hide-details
          readonly
          :color="color"
          :model-value="isSelected"
          @click.stop="nodeSelected"
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
          @change="onNodeChanged"
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

const emit = defineEmits(["change"]);

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
        status =
          status &&
          selectedNodes!.has(child.id) &&
          checkAllChildrenSelected(child, status);
      } else {
        status = status && selectedNodes!.has(child.id);
      }
    }
  }
  return status;
};

const checkAtLeastOneChildSelected = (
  currentNode: TreeViewNodeItem,
  status: boolean
): boolean => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      if (child.children) {
        status =
          status ||
          selectedNodes!.has(child.id) ||
          checkAtLeastOneChildSelected(child, status);
      } else {
        status = status || selectedNodes!.has(child.id);
      }
    }
  }
  return status;
};

const classes = computed(() => ({
  "v-treeview-node--leaf": !hasChildren.value,
}));

const isOpen = computed(() => openedNodes?.has(props.item.id));

const isSelected = computed(() => selectedNodes?.has(props.item.id));

const checkChildSelectStatus = (type: "all" | "atLeastOne") => {
  let res = true;
  for (const node of nodes!) {
    const n = findNode(props.item.id, node);
    if (n) {
      const selectionStatus =
        type === "all"
          ? checkAllChildrenSelected(n, true)
          : checkAtLeastOneChildSelected(n, false);
      res = selectionStatus;
    }
  }
  return res;
};

const hasChildren = computed(
  () => !!props.item.children && !!props.item.children.length
);

const nodeIcon = computed(() => {
  if (hasChildren.value) {
    if (checkChildSelectStatus("all")) return "mdi-checkbox-marked";
    if (checkChildSelectStatus("atLeastOne")) return "mdi-minus-box";
    return undefined;
  }
  return "mdi-checkbox-marked";
});

const onNodeChanged = () => {
  // Check if all children selected
  if (hasChildren.value) {
    if (checkChildSelectStatus("all")) {
      if (!selectedNodes!.has(props.item.id)) {
        nodeSelected();
      }
    } else {
      if (!checkChildSelectStatus("atLeastOne")) {
        if (selectedNodes!.has(props.item.id)) {
          nodeSelected();
        }
      }
    }
  }
};

const nodeSelected = () => {
  emitNodeSelect(props.item.id);
  emit("change", props.item.id);
};

const openNode = () => {
  if (hasChildren.value) emitNodeOpen(props.item.id);
};
</script>
