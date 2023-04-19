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
import { computed, inject, reactive, watch } from "vue";
import { TreeViewNodeItem } from "./models";
import "./treeView.sass";

const emit = defineEmits(["change"]);

const { emit: emitNodeSelect } = useEventBus<number>("select-node");
const { emit: emitNodeOpen } = useEventBus<number>("open-node");

const selectedNodes = inject<Set<number>>("selected-nodes");
const openedNodes = inject<Set<number>>("opened-nodes");

const props = defineProps<{
  level: number;
  item: TreeViewNodeItem;
  parentIsDisabled?: boolean;
  color?: string;
}>();

const state = reactive({
  hasLoaded: false,
  isActive: false,
  isIndeterminate: false,
  isLoading: false,
  isSelected: false,
});

const classes = computed(() => ({
  "v-treeview-node--leaf": !hasChildren.value,
  "v-treeview-node--selected": state.isSelected,
}));

const isOpen = computed(() => openedNodes?.has(props.item.id));
const isSelected = computed(() => selectedNodes?.has(props.item.id));

const computedIcon = computed(() => {
  if (state.isIndeterminate) return "mdi-account";
  else if (state.isSelected) return "mdi-account";
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

watch(
  () => state.isSelected,
  (val) => {
    emit("change", val);
  }
);
</script>
