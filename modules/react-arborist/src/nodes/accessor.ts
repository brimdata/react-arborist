export type NodeDataAccessors<T> = {
  id: (d: T) => string;
  children: (d: T) => T[];
  isLeaf: (d: T) => boolean;
};

export class Accessor<T> {
  constructor(public accessors: Partial<NodeDataAccessors<T>> = {}) {}

  getId(d: T): string {
    if (this.accessors.id) {
      return this.accessors.id(d);
    } else if (d && typeof d === "object" && "id" in d) {
      return d.id as string;
    } else {
      throw new Error("No id found for node data. Specify an id accessor.");
    }
  }

  getChildren(d: T): null | T[] {
    if (this.accessors.children) {
      return this.accessors.children(d);
    } else if (d && typeof d === "object" && "children" in d) {
      return d.children as T[];
    } else {
      return null;
    }
  }

  getIsLeaf(d: T): boolean {
    if (this.accessors.isLeaf) {
      return this.accessors.isLeaf(d);
    } else {
      return !this.getChildren(d);
    }
  }
}
