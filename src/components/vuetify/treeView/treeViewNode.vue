<template>
  <div :class="classes" class="v-treeview-node">Node</div>
</template>

<script lang="ts" setup>
import { getObjectValueByPath } from "@/utils/helpers";
import { computed, reactive } from "vue";
import { TreeViewPropsBase } from "./models";

interface TreeViewNodeProps extends TreeViewPropsBase {
  level?: number;
  item?: Object | null;
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

const children = computed(() => {
  const children = getObjectValueByPath(props.item, props.itemChildren);
  /*
  return (
    children &&
    children.filter(
      (child: any) =>
        !this.treeview.isExcluded(getObjectValueByPath(child, props.itemKey))
    )
  );
  */
  return [];
});

const text = computed(() => {
  return getObjectValueByPath(props.item, props.itemText);
});

const scopedProps = computed(() => {
  return {
    item: props.item,
    leaf: !children.value,
    selected: state.isSelected,
    indeterminate: state.isIndeterminate,
    active: state.isActive,
    open: state.isOpen,
  };
});

const computedIcon = computed(() => {
  if (state.isIndeterminate) return props.indeterminateIcon;
  else if (state.isSelected) return props.onIcon;
  else return props.offIcon;
});

const hasChildren = computed(() => {
  return !!children.value && (!!children.value.length || !!props.loadChildren);
});
</script>
