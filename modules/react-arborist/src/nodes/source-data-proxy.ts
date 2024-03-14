import { NodeObject } from "../types/node-object";
import { SourceDataAccessor } from "./source-data-accessor";

export class SourceDataProxy<T> implements NodeObject<T> {
  id: string;
  level: number;
  isLeaf: boolean;
  children: SourceDataProxy<T>[] | null = null;

  constructor(
    public parent: SourceDataProxy<T> | null,
    public sourceData: T,
    private accessor: SourceDataAccessor<T>,
  ) {
    this.id = this.accessor.getId(sourceData);
    this.level = parent === null ? 0 : parent.level + 1;
    this.isLeaf = this.accessor.getIsLeaf(sourceData);
    this.children =
      this.sourceChildren?.map((sourceChild) => {
        return new SourceDataProxy(this, sourceChild, accessor);
      }) || null;
  }

  get sourceChildren() {
    return this.accessor.getChildren(this.sourceData);
  }

  insertChildren(index: number, ...data: T[]) {
    this.sourceChildren?.splice(index, 0, ...data);
  }

  update(changes: Partial<T>) {
    this.sourceData = { ...this.sourceData, ...changes };
  }

  deleteChild(data: T) {
    if (this.sourceChildren) {
      const index = this.sourceChildren?.indexOf(data);
      this.sourceChildren.splice(index, 1);
    }
  }
}
