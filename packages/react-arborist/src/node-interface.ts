// const handlers = useMemo(() => {
//   return {
//     select: (
//       e: React.MouseEvent,
//       args: { selectOnClick: boolean } = { selectOnClick: true }
//     ) => {
//       if (node.rowIndex === null) return;
//       if (args.selectOnClick || e.metaKey || e.shiftKey) {
//         tree.select(node.id, { multi: e.metaKey, contiguous: e.shiftKey });
//       } else {
//         tree.select(null);
//       }
//     },
//     toggle: (e: React.MouseEvent) => {
//       e.stopPropagation();
//       tree.onToggle(node.id, !node.isOpen);
//     },
//     edit: () => tree.edit(node.id),
//     submit: (name: string) => {
//       name.trim() ? tree.submit(node.id, name) : tree.reset(node.id);
//     },
//     reset: () => tree.reset(node.id),
//   };
// }, [node, tree]);

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
// }, [
//   isEditing,
//   isSelected,
//   prevSelected,
//   nextSelected,
//   isHoveringOverChild,
//   isOpen,
//   isDragging,
//   isOverFolder,
// ]);

import { TreeApi } from "./tree-api";
import { IdObj } from "./types";

type Params<T extends IdObj> = {
  id: string;
  data: T;
  level: number;
  children: NodeInterface<T>[] | null;
  parent: NodeInterface<T> | null;
  isDraggable: boolean;
  isDroppable: boolean;
  rowIndex: number | null;
  tree: TreeApi<T>;
};

export class NodeInterface<T extends IdObj = IdObj> {
  tree: TreeApi<T>;
  id: string;
  data: T;
  level: number;
  children: NodeInterface<T>[] | null;
  parent: NodeInterface<T> | null;
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
