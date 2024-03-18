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

  /* Open State */

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
      ids: [id], // maybe move this to payload
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
    return this.props.selection.value[id] === true;
  }

  select(id: string) {
    this.props.selection.onChange({ type: "select", id });
  }

  selectMulti(id: string) {
    this.props.selection.onChange({ type: "select-multi", id });
  }

  selectContiguous(id: string) {
    this.props.selection.onChange({
      type: "select-contiguous",
      id,
      tree: this,
    });
  }

  selectAll() {
    return this.props.selection.onChange({
      type: "select-all",
      tree: this,
    });
  }

  deselect(id: string) {
    this.props.selection.onChange({ type: "deselect", id });
  }

  /* Node Getters */

  get firstNode() {
    return this.rows[0] || null;
  }

  get lastNode() {
    const len = this.rows.length;
    return len === 0 ? null : this.rows[len - 1];
  }

  nodesBetween(startId: string | null, endId: string | null) {
    if (startId === null || endId === null) return [];
    const index1 = this.indexOf(startId) ?? 0;
    const index2 = this.indexOf(endId);
    if (index2 === null) return [];
    const start = Math.min(index1, index2);
    const end = Math.max(index1, index2);
    return this.rows.slice(start, end + 1);
  }

  indexOf(id: string) {
    if (!id) return null;
    const index = this.rows.findIndex((node) => node.id === id);
    return index === -1 ? null : index;
  }
}
