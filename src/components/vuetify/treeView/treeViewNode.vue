<template>
  <div
    :aria-expanded="state.isOpen"
    :class="classes"
    class="v-treeview-node v-treeview-node--click"
  >
    <div class="v-treeview-node__root" @click="open">
      <div class="v-treeview-node__content">
        <div class="v-treeview-node__level" v-for="l in level" :key="l" />
        <v-btn
          v-if="hasChildren"
          size="35"
          variant="flat"
          class="v-treeview-node__toggle"
          :icon="state.isOpen ? 'mdi-chevron-down' : 'mdi-chevron-right'"
        />
        <div class="v-treeview-node__level" v-else />
        <v-checkbox-btn
          density="compact"
          hide-details
          readonly
          :model-value="isSelected"
          @click="selectNode"
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
      <div class="v-treeview-node__children" v-if="state.isOpen">
        <tree-view-node
          v-for="child in item.children"
          :level="level + 1"
          :key="child.id"
          :item="child"
        />
      </div>
    </v-expand-transition>
  </div>
</template>

<script lang="ts" setup>
import { Ref, computed, inject, reactive, watch } from "vue";
import { findNode } from "./helper";
import { TreeViewNodeCacheItem, TreeViewNodeItem } from "./models";
import "./treeView.sass";

const treeViewNodeCacheProvider = inject<Ref<TreeViewNodeCacheItem[]>>(
  "tree-view-node-cache"
);

const emit = defineEmits(["change"]);

const props = defineProps<{
  level: number;
  item: TreeViewNodeItem;
  parentIsDisabled?: boolean;
}>();

const state = reactive({
  hasLoaded: false,
  isActive: false,
  isIndeterminate: false,
  isLoading: false,
  isOpen: false,
  isSelected: false,
});

const classes = computed(() => ({
  "v-treeview-node--leaf": !hasChildren.value,
  "v-treeview-node--selected": state.isSelected,
}));

const computedIcon = computed(() => {
  if (state.isIndeterminate) return "mdi-account";
  else if (state.isSelected) return "mdi-account";
  else return "mdi-account";
});

const hasChildren = computed(
  () => !!props.item.children && !!props.item.children.length
);

const open = () => {
  if (!!props.item.children?.length && !!props.item.children.length) {
    state.isOpen = !state.isOpen;
  }
};

const selectNode = () => {
  if (treeViewNodeCacheProvider?.value) {
    for (const n of treeViewNodeCacheProvider.value) {
      const node = findNode(props.item.id, n);
      if (node !== null) {
        node.isOpen = true;
      }
    }
  }
};

const isSelected = computed(() => {
  if (treeViewNodeCacheProvider?.value) {
    return treeViewNodeCacheProvider.value.find((n) => n.id === props.item.id)
      ?.isOpen;
  }
  return false;
});

watch(
  () => state.isSelected,
  (val) => {
    emit("change", val);
  }
);
</script>
