import { NodeObject } from "../types/node-object";
import { Accessor } from "./source-data-accessor";

export class SourceDataProxy<T> implements NodeObject<T> {
  id: string;
  level: number;
  isLeaf: boolean;
  children: SourceDataProxy<T>[] | null = null;

  constructor(
    public parent: SourceDataProxy<T> | null,
    public sourceData: T,
    private accessor: Accessor<T>,
  ) {
    this.id = this.accessor.getId(sourceData);
    this.level = parent === null ? 0 : parent.level + 1;
    this.isLeaf = this.accessor.getIsLeaf(sourceData);

    const sourceChildren = this.accessor.getChildren(sourceData);
    if (sourceChildren) {
      this.children = sourceChildren.map((sourceChild) => {
        return new SourceDataProxy(this, sourceChild, accessor);
      });
    }
  }
}
