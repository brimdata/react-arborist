import { Sorter } from "./sorter";
import { NodeObject, Accessors } from "./types";

export class NodeModel<T> implements NodeObject<T> {
  id: string;
  level: number;
  children: NodeModel<T>[] | null = null;

  static initChildren<T>(
    parent: NodeModel<T>,
    sourceArray: T[] | null,
    access: Accessors<T>,
  ) {
    if (!sourceArray) return null;
    return new Sorter(access)
      .sort(sourceArray)
      .map((sourceData) => new NodeModel<T>(parent, sourceData, access));
  }

  constructor(
    public parent: NodeModel<T> | null,
    public sourceData: T,
    public access: Accessors<T>,
  ) {
    this.id = this.access.id(sourceData);
    this.level = parent === null ? 0 : parent.level + 1;
    this.children = NodeModel.initChildren(this, this.sourceChildren, access);
  }

  get isLeaf() {
    return this.access.isLeaf(this.sourceData);
  }

  get sourceChildren() {
    return this.access.children(this.sourceData);
  }

  get childIndex() {
    return this.parent?.children?.indexOf(this) ?? -1;
  }

  insertChildren(index: number, ...data: T[]) {
    const nodes = NodeModel.initChildren(this, data, this.access) ?? [];
    this.children?.splice(index, 0, ...nodes);
    this.sourceChildren?.splice(index, 0, ...data);
  }

  update(changes: Partial<T>) {
    for (const key in changes) {
      // @ts-ignore
      this.sourceData[key] = changes[key];
    }
  }

  removeChild(index: number) {
    this.children?.splice(index, 1);
    this.sourceChildren?.splice(index, 1);
  }

  drop() {
    const index = this.childIndex;
    if (index) this.parent!.removeChild(index);
  }
}

export class RootNodeModel<T> extends NodeModel<T> {
  constructor(
    public sourceDataArray: T[],
    public access: Accessors<T>,
  ) {
    super(null, null as T, access);
  }

  get sourceChildren() {
    return this.sourceDataArray;
  }
}
