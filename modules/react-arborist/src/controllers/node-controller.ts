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

  get isOpen() {
    return this.isInternal && this.tree.isOpen(this.id);
  }

  get isSelected() {
    return this.tree.isSelected(this.id);
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
}
