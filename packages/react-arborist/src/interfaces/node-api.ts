// const state = useMemo(() => {
//   return {
//     isEditing,
//     isDragging,
//     isSelectedStart: isSelected && !prevSelected,
//     isSelectedEnd: isSelected && !nextSelected,
//     isSelected,
//     isHoveringOverChild,
//     isOpen,
//     isOverFolder,
//   };

import { TreeApi } from "./tree-api";
import { IdObj } from "../types";

type Params<T extends IdObj> = {
  id: string;
  data: T;
  level: number;
  children: NodeApi<T>[] | null;
  parent: NodeApi<T> | null;
  isDraggable: boolean;
  isDroppable: boolean;
  rowIndex: number | null;
  tree: TreeApi<T>;
};

export class NodeApi<T extends IdObj = IdObj> {
  tree: TreeApi<T>;
  id: string;
  data: T;
  level: number;
  children: NodeApi<T>[] | null;
  parent: NodeApi<T> | null;
  isDraggable: boolean;
  isDroppable: boolean;
  rowIndex: number | null;

  constructor(params: Params<T>) {
    this.tree = params.tree;
    this.id = params.id;
    this.data = params.data;
    this.level = params.level;
    this.children = params.children;
    this.parent = params.parent;
    this.isDraggable = params.isDraggable;
    this.isDroppable = params.isDroppable;
    this.rowIndex = params.rowIndex;
  }

  get isLeaf() {
    return !Array.isArray(this.children);
  }

  get isInternal() {
    return !this.isLeaf;
  }

  get isOpen() {
    return this.isLeaf ? false : this.tree.isOpen(this.id);
  }

  get isEditing() {
    return this.tree.editingId === this.id;
  }

  get isSelected() {
    return this.tree.isSelected(this.id);
  }

  select(opts: { multi?: boolean; contiguous?: boolean }) {
    this.tree.select(this.id, opts);
  }

  activate() {
    this.tree.activate(this);
  }

  focus() {
    this.tree.focus(this.id);
  }

  toggle() {
    this.tree.toggle(this.id);
  }

  submit(value: string) {
    this.tree.submit(this.id, value);
  }

  reset() {
    this.tree.reset(this.id);
  }
}
