import { createChildren } from "./create-node-model.js";
import { NodeObject, Accessors } from "./types.js";

type Attrs<T> = {
  id: string;
  isLeaf: boolean;
  level: number;

  sourceData: T;
  sourceChildren: T[] | null;

  parent: NodeModel<T>;
  children: NodeModel<T>[] | null;

  access: Accessors<T>;
};

export class NodeModel<T> implements NodeObject<T> {
  constructor(public attrs: Attrs<T>) {}

  insertChildren(index: number, ...data: T[]) {
    const nodes = createChildren(this, data, this.access) ?? [];
    this.children?.splice(index, 0, ...nodes);
    this.sourceChildren?.splice(index, 0, ...data);
  }

  update(changes: Partial<T>) {
    for (const key in changes) {
      // @ts-ignore
      this.sourceData[key] = changes[key];
    }
  }

  deleteChild(index: number) {
    this.children?.splice(index, 1);
    this.sourceChildren?.splice(index, 1);
  }

  drop() {
    this.parent!.deleteChild(this.childIndex);
  }

  get id() {
    return this.attrs.id;
  }

  get isLeaf() {
    return this.attrs.isLeaf;
  }

  get level() {
    return this.attrs.level;
  }

  get sourceData() {
    return this.attrs.sourceData;
  }

  get sourceChildren() {
    return this.attrs.sourceChildren;
  }

  get parent() {
    return this.attrs.parent;
  }

  get children() {
    return this.attrs.children;
  }

  get access() {
    return this.attrs.access;
  }

  get childIndex() {
    return this.parent.children!.indexOf(this);
  }
}
