import { TreeViewProps } from "../types/tree-view-props";
import { NodeController } from "./node-controller";

export class TreeController<T> {
  rows: NodeController<T>[];

  constructor(public props: TreeViewProps<T>) {
    this.rows = NodeController.constructRows(this, props.nodes.value);
  }

  isOpen(id: string) {
    return true; // to do
  }
}
