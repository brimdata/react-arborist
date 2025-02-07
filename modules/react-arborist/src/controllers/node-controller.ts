import { NodeObject } from "../nodes/types.js";
import { TreeController } from "./tree-controller.js";

export class NodeController<T> {
  static constructRows<T>(tree: TreeController<T>, objects: NodeObject<T>[]) {
    const queue = [...objects];
    const rows = [];
    let index = 0;
    while (queue.length > 0) {
      const object = queue.shift()!;
      if (tree.isVisible(object.id)) {
        const node = new NodeController(tree, object, index++);
        rows.push(node);
        if (node.isOpen) queue.unshift(...node.object.children!);
      }
    }
    return rows;
  }

  constructor(
    public tree: TreeController<T>,
    public object: NodeObject<T>,
    public rowIndex: number,
  ) {}

  /* Data Access */
  get id() {
    return this.object.id;
  }

  get isInternal() {
    return !this.isLeaf;
  }

  get isLeaf() {
    return this.object.isLeaf;
  }

  get level() {
    return this.object.level;
  }

  get parentId() {
    return this.object.parent?.id || null;
  }

  get parent(): NodeController<T> | null {
    if (this.parentId) {
      return this.tree.get(this.parentId);
    } else {
      return null;
    }
  }

  get childIndex() {
    return this.object.childIndex;
  }

  get data() {
    return this.object.sourceData;
  }

  get next() {
    return this.tree.nodeAfter(this);
  }

  get prev() {
    return this.tree.nodeBefore(this);
  }

  get state() {
    return {
      /* type */
      isLeaf: this.isLeaf,
      isInternal: this.isInternal,
      /* open */
      isOpen: this.isOpen,
      isClosed: this.isClosed,
      /* selection */
      isSelected: this.isSelected,
      isSelectedStart: this.isSelectedStart,
      isSelectedEnd: this.isSelectedEnd,
      isOnlySelection: this.isOnlySelection,
      /* edit */
      isEditing: this.isEditing,
      /* focus */
      isFocused: this.isFocused,
      /* dnd */
      willReceiveDrop: this.willReceiveDrop,
      isDragging: this.isDragging,
    } as Record<string, boolean>;
  }

  isDescendantOf(node: NodeController<T>) {
    let cursor: NodeController<any> | null = this;
    while (cursor) {
      if (cursor.id === node.id) return true;
      cursor = cursor.parent;
    }
    return false;
  }

  /* Open State */
  get isOpen() {
    return this.isInternal && this.tree.isOpen(this.id);
  }

  get isClosed() {
    return this.isInternal && !this.isOpen;
  }

  open() {
    this.tree.open(this.id);
  }

  close() {
    this.tree.close(this.id);
  }

  toggle() {
    if (this.isInternal) {
      this.isOpen ? this.close() : this.open();
    }
  }

  /* Edit State */
  get isEditing() {
    return this.tree.isEditId(this.id);
  }

  edit() {
    this.tree.edit(this.id);
  }

  submit(changes: Partial<T>) {
    this.tree.submit(this.id, changes);
  }

  /* Selection State */

  get isSelected() {
    return this.tree.isSelected(this.id);
  }

  get isSelectedStart() {
    return this.isSelected && !this.prev?.isSelected;
  }

  get isSelectedEnd() {
    return this.isSelected && !this.next?.isSelected;
  }

  get isOnlySelection() {
    return this.isSelected && this.tree.hasOneSelection;
  }

  select() {
    this.tree.select(this.id);
  }

  selectMulti() {
    this.tree.selectMulti(this.id);
  }

  selectContiguous() {
    this.tree.selectContiguous(this.id);
  }

  deselect() {
    this.tree.deselect(this.id);
  }

  /* Drag and Drop State */

  get isDraggable() {
    return this.tree.isDraggable(this);
  }

  get isDragging() {
    return this.tree.isDragging(this.id);
  }

  get willReceiveDrop() {
    return this.tree.willReceiveDrop(this.id);
  }

  /* Focus */

  get isFocused() {
    return this.tree.isFocused(this.id);
  }
}
