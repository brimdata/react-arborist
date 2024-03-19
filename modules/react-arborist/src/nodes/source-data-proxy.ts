import { NodeObject } from "./node-object";
import { SourceDataAccessor } from "./source-data-accessor";

export class SourceDataProxy<T> implements NodeObject<T> {
  id: string;
  level: number;
  children: SourceDataProxy<T>[] | null = null;

  constructor(
    public parent: SourceDataProxy<T> | null,
    public sourceData: T,
    private accessor: SourceDataAccessor<T>,
  ) {
    this.id = this.accessor.getId(sourceData);
    this.level = parent === null ? 0 : parent.level + 1;
    const initChild = (d: T) => new SourceDataProxy(this, d, accessor);
    this.children = this.sourceChildren?.map(initChild) || null;
  }

  get isLeaf() {
    return this.accessor.getIsLeaf(this.sourceData);
  }

  get sourceChildren() {
    return this.accessor.getChildren(this.sourceData);
  }

  insertChildren(index: number, ...data: T[]) {
    this.sourceChildren?.splice(index, 0, ...data);
  }

  update(changes: Partial<T>) {
    for (const key in changes) {
      // @ts-ignore
      this.sourceData[key] = changes[key];
    }
  }

  deleteChild(data: T) {
    if (this.sourceChildren) {
      const index = this.sourceChildren?.indexOf(data);
      this.sourceChildren.splice(index, 1);
    }
  }
}
