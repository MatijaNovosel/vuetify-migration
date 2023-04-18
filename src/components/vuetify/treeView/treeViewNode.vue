<template>
  <div :aria-expanded="state.isOpen" :class="classes" class="v-treeview-node">
    <div class="v-treeview-node__children">
      <div class="v-treeview-node__root">
        <div class="v-treeview-node__content">
          <v-btn
            v-if="hasChildren"
            variant="flat"
            class="v-treeview-node__toggle"
            icon="mdi-chevron-right"
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getObjectValueByPath } from "@/utils/helpers";
import { computed, reactive } from "vue";
import { TreeViewNodeItem, TreeViewPropsBase } from "./models";
import "./treeView.sass";

interface TreeViewNodeProps extends TreeViewPropsBase {
  level?: number;
  item: TreeViewNodeItem;
  parentIsDisabled?: boolean;
}

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

const key = computed(() => {
  return getObjectValueByPath(props.item, props.itemKey);
});

const text = computed(() => {
  return getObjectValueByPath(props.item, props.itemText);
});

const scopedProps = computed(() => ({
  item: props.item,
  leaf: !props.item.children,
  selected: state.isSelected,
  indeterminate: state.isIndeterminate,
  active: state.isActive,
  open: state.isOpen,
}));

const computedIcon = computed(() => {
  if (state.isIndeterminate) return props.indeterminateIcon;
  else if (state.isSelected) return props.onIcon;
  else return props.offIcon;
});

const hasChildren = computed(
  () =>
    !!props.item.children &&
    (!!props.item.children.length || !!props.loadChildren)
);
</script>
