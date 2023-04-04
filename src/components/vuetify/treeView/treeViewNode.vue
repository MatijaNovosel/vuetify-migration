<template>
  <div class="bg-blue pa-4">Hello</div>
</template>

<script lang="ts" setup>
import { getObjectValueByPath } from "@/utils/helpers";
import { computed, reactive } from "vue";

const props = defineProps<{
  level: number;
  item: Object | null;
  parentIsDisabled: boolean;
  activatable: boolean;
  activeClass: string;
  color: string;
  disablePerNode: boolean;
  expandIcon: string;
  indeterminateIcon: string;
  itemChildren: string;
  itemDisabled: string;
  itemKey: string;
  itemText: string;
  loadChildren: (item: any) => Promise<void>;
  loadingIcon: string;
  offIcon: string;
  onIcon: string;
  openOnClick: boolean;
  rounded: boolean;
  selectable: boolean;
  selectedColor: string;
  shaped: boolean;
  transition: boolean;
  selectionType: "leaf" | "independent";
}>();

const state = reactive({
  hasLoaded: false,
  isActive: false,
  isIndeterminate: false,
  isLoading: false,
  isOpen: false,
  isSelected: false,
});

const disabled = computed(() => {
  return (
    getObjectValueByPath(props.item, props.itemDisabled) ||
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
