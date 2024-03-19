import { NodeObject } from "../nodes/node-object";
import { TreeController } from "./tree-controller";

export class NodeController<T> {
  static constructRows<T>(tree: TreeController<T>, objects: NodeObject<T>[]) {
    const queue = [...objects];
    const rows = [];
    let index = 0;
    while (queue.length > 0) {
      const object = queue.shift()!;
      const node = new NodeController(tree, object, index++);
      rows.push(node);
      if (node.isOpen) queue.unshift(...node.object.children!);
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

  get parent() {
    if (this.parentId) {
      return this.tree.get(this.parentId);
    } else {
      return null;
    }
  }

  get childIndex() {
    const siblings = this.object.parent
      ? this.object.parent.children
      : this.tree.rootNodeObjects;
    if (!siblings) throw new Error("No siblings found for node id: " + this.id);
    return siblings.findIndex((child) => child.id === this.id);
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
}
