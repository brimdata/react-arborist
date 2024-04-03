import { createChildren } from "./create-node-model";
import { NodeModel } from "./node-model";
import { Accessors } from "./types";

export class RootNodeModel<T> extends NodeModel<T> {
  constructor(sourceChildren: T[], access: Accessors<T>) {
    super({
      id: null!,
      isLeaf: false,
      parent: null!,
      level: -1,
      sourceData: null!,
      sourceChildren,
      access,
      children: null,
    });

    this.attrs.children = createChildren(this, sourceChildren, access);
  }
}
