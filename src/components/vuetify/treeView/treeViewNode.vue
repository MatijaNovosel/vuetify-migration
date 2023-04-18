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
          icon="mdi-chevron-right"
        />
        <div class="v-treeview-node__level" v-else />
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
          v-for="(child, i) in item.children"
          :level="level + 1"
          :key="i"
          :item="child"
        />
      </div>
    </v-expand-transition>
  </div>
</template>

<script lang="ts" setup>
import { getObjectValueByPath } from "@/utils/helpers";
import { computed, reactive } from "vue";
import { TreeViewNodeItem, TreeViewPropsBase } from "./models";
import "./treeView.sass";

interface TreeViewNodeProps extends TreeViewPropsBase {
  level: number;
  item: TreeViewNodeItem;
  parentIsDisabled?: boolean;
}

const emit = defineEmits(["change"]);

const props = defineProps<TreeViewNodeProps>();

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
  "v-treeview-node--click": props.openOnClick,
  "v-treeview-node--disabled": disabled.value,
  "v-treeview-node--rounded": props.rounded,
  "v-treeview-node--shaped": props.shaped,
  "v-treeview-node--selected": state.isSelected,
}));

const disabled = computed(() => {
  return (
    getObjectValueByPath(props.item, props.itemDisabled || "") ||
    (!props.disablePerNode &&
      props.parentIsDisabled &&
      props.selectionType === "leaf")
  );
});

const computedIcon = computed(() => {
  if (state.isIndeterminate) return props.indeterminateIcon;
  else if (state.isSelected) return props.onIcon;
  else return props.offIcon;
});

const hasChildren = computed(
  () => !!props.item.children && !!props.item.children.length
);

const open = () => {
  if (!!props.item.children?.length && !!props.item.children.length) {
    state.isOpen = !state.isOpen;
  }
};
</script>
