export type NodeCache = Set<string | number>;
export type NodeArray = (string | number)[];

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
