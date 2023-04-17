export type NodeCache = Set<string | number>;
export type NodeArray = (string | number)[];

export interface TreeViewPropsBase {
  activatable?: boolean;
  activeClass?: string;
  color?: string;
  disablePerNode?: boolean;
  expandIcon?: string;
  indeterminateIcon?: string;
  itemChildren: string;
  itemDisabled?: string;
  itemKey: string;
  itemText: string;
  loadChildren?: (item: any) => Promise<void>;
  loadingIcon?: string;
  offIcon?: string;
  onIcon?: string;
  openOnClick?: boolean;
  rounded?: boolean;
  selectable?: boolean;
  selectedColor?: string;
  shaped?: boolean;
  transition?: boolean;
  selectionType?: "leaf" | "independent";
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
