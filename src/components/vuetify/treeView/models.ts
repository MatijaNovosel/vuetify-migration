export type NodeCache = Set<string | number>;
export type NodeArray = (string | number)[];

export interface TreeViewPropsBase {
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
}

export interface TreeViewNodeProps extends TreeViewPropsBase {
  level: number;
  item: Object | null;
  parentIsDisabled: boolean;
}

export interface TreeViewProps extends TreeViewPropsBase {
  active: any[];
  dense: boolean;
  disabled: boolean;
  filter: () => void;
  hoverable: boolean;
  items: any[];
  multipleActive: boolean;
  open: any[];
  openAll: boolean;
  returnObject: boolean;
  search: string;
  value: any[];
}

export interface NodeState {
  parent: number | string | null;
  children: (number | string)[];
  vnode: any;
  isActive: boolean;
  isSelected: boolean;
  isIndeterminate: boolean;
  isOpen: boolean;
  item: any;
}
