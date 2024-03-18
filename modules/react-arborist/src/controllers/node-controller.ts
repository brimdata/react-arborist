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

  get data() {
    return this.object.sourceData;
  }

  /* Open State */
  get isOpen() {
    return this.isInternal && this.tree.isOpen(this.id);
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
}
