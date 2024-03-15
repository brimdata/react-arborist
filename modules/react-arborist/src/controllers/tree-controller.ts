import { TreeViewProps } from "../types/tree-view-props";
import { NodeController } from "./node-controller";

export class TreeController<T> {
  rows: NodeController<T>[];

  constructor(public props: TreeViewProps<T>) {
    this.rows = NodeController.constructRows(this, props.nodes.value);
  }

  get width() {
    return this.props.width ?? 300;
  }

  get height() {
    return this.props.height ?? 500;
  }

  get rowHeight() {
    return this.props.rowHeight ?? 24;
  }

  get overscanCount() {
    return this.props.overscanCount ?? 1;
  }

  get indent() {
    return this.props.indent ?? 24;
  }

  isOpen(id: string) {
    if (id in this.props.opens.value) {
      return this.props.opens.value[id];
    } else {
      return this.props.openByDefault; // default open state
    }
  }

  open(id: string) {
    this.props.opens.onChange({
      value: { ...this.props.opens.value, [id]: true },
      type: "open",
      ids: [id],
    });
  }

  close(id: string) {
    this.props.opens.onChange({
      value: { ...this.props.opens.value, [id]: false },
      type: "close",
      ids: [id], // maybe move this to payload?
    });
  }

  /* Edit State */

  isEditId(id: string) {
    return this.props.edit.value === id;
  }

  edit(id: string) {
    this.props.edit.onChange({
      value: id,
    });
  }

  submit(id: string, changes: Partial<T>) {
    this.props.nodes.onChange({
      type: "update",
      payload: { id, changes },
    });
    this.props.edit.onChange({
      value: null,
    });
  }

  /* Selection State */

  isSelected(id: string) {
    return false; // to do
  }
}
