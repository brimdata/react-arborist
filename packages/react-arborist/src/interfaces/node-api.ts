import { TreeApi } from "./tree-api";
import { IdObj } from "../types/utils";
import { ROOT_ID } from "../data/create-root";

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

  get next(): NodeApi<T> | null {
    if (this.rowIndex === null) return null;
    return this.tree.at(this.rowIndex + 1);
  }

  get prev(): NodeApi<T> | null {
    if (this.rowIndex === null) return null;
    return this.tree.at(this.rowIndex - 1);
  }

  get nextSibling(): NodeApi<T> | null {
    const i = this.childIndex;
    return this.parent?.children![i + 1] ?? null;
  }

  get isRoot() {
    return this.id === ROOT_ID;
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

  get isSelectedStart() {
    return this.isSelected && !this.prev?.isSelected;
  }

  get isSelectedEnd() {
    return this.isSelected && !this.next?.isSelected;
  }

  get isFocused() {
    return this.tree.isFocused(this.id);
  }

  get childIndex() {
    if (this.parent && this.parent.children) {
      return this.parent.children.findIndex((child) => child.id === this.id);
    } else {
      return -1;
    }
  }

  get isDragging() {
    return this.tree.isDragging(this.id);
  }

  get willReceiveDrop() {
    return this.tree.willReceiveDrop(this.id);
  }

  get state() {
    return {
      isEditing: this.isEditing,
      isDragging: this.isDragging,
      isSelected: this.isSelected,
      isSelectedStart: this.isSelectedStart,
      isSelectedEnd: this.isSelectedEnd,
      isFocused: this.isFocused,
      isOpen: this.isOpen,
      willReceiveDrop: this.willReceiveDrop,
    };
  }

  select() {
    this.tree.select(this);
  }

  deselect() {
    this.tree.deselect(this);
  }

  selectMulti() {
    this.tree.selectMulti(this);
  }

  selectContiguous() {
    this.tree.selectContiguous(this);
  }

  preview() {
    return this.tree.preview(this);
  }

  activate() {
    this.tree.activate(this);
  }

  focus() {
    this.tree.focus(this);
  }

  toggle() {
    this.tree.toggle(this);
  }

  submit(value: string) {
    this.tree.submit(this, value);
  }

  reset() {
    this.tree.reset(this);
  }

  clone() {
    return new NodeApi<T>({ ...this });
  }

  edit() {
    return this.tree.edit(this);
  }
}
