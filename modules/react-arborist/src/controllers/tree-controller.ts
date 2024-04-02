import { Align, FixedSizeList } from "react-window";
import { CursorState } from "../cursor/types";
import { safeToDrop } from "../dnd/safe-to-drop";
import { ShortcutManager } from "../shortcuts/shortcut-manager";
import { NodeState } from "../types/state";
import { TreeViewProps } from "../types/tree-view-props";
import { NodeController } from "./node-controller";

export class TreeController<T> {
  rows: NodeController<T>[];
  listElement: FixedSizeList | null = null;

  constructor(public props: TreeViewProps<T>) {
    this.rows = NodeController.constructRows(this, props.nodes.value);
  }

  /* Dimensions */

  get width() {
    return this.props.width ?? 300;
  }

  get height() {
    return this.props.height ?? 500;
  }

  get listHeight() {
    return this.rows.length * this.rowHeight;
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

  get paddingTop() {
    return this.props.padding ?? this.props.paddingTop ?? 0;
  }

  get paddingBottom() {
    return this.props.padding ?? this.props.paddingBottom ?? 0;
  }

  /* Node Getters */

  get rootNodeObjects() {
    return this.props.nodes.value;
  }

  get focusedNode() {
    console.log("get", this.props.focus.value.id);
    return this.get(this.props.focus.value.id);
  }

  get firstNode() {
    return this.rows[0] || null;
  }

  get lastNode() {
    const len = this.rows.length;
    return len === 0 ? null : this.rows[len - 1] || null;
  }

  get nextNode() {
    if (this.focusedNode) {
      return this.rows[this.focusedNode.rowIndex + 1] || null;
    }
    return null;
  }

  get prevNode() {
    if (this.focusedNode) {
      return this.rows[this.focusedNode.rowIndex - 1] || null;
    }
    return null;
  }

  get dragNodes() {
    return this.getAll(this.props.dnd.value.dragItems);
  }

  get dragSourceNode() {
    return this.get(this.props.dnd.value.dragSourceId);
  }

  get dropTargetParentNode() {
    return this.get(this.props.dnd.value.targetParentId);
  }

  get dropTargetIndex() {
    return this.props.dnd.value.targetIndex;
  }

  get(id: string | null): NodeController<T> | null {
    if (id === null) return null;
    const index = this.indexOf(id);
    if (index !== null) {
      return this.rows[index] || null;
    } else {
      return null;
    }
  }

  getAll(ids: string[]) {
    return ids
      .map((id) => this.get(id))
      .filter((n) => !!n) as NodeController<T>[];
  }

  nodeBefore(node: NodeController<T>) {
    return this.rows[node.rowIndex - 1] || null;
  }

  nodeAfter(node: NodeController<T>) {
    return this.rows[node.rowIndex + 1] || null;
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

  /* Open State */

  isOpen(id: string) {
    if (id in this.props.opens.value) {
      return this.props.opens.value[id] || false;
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
    this.props.edit.onChange({ value: id });
  }

  submit(id: string, changes: Partial<T>) {
    this.props.nodes.onChange({ type: "update", id, changes });
    this.props.edit.onChange({ value: null });
  }

  /* Selection State */

  get selectedIds() {
    const ids = [];
    for (const id in this.props.selection.value) {
      if (this.props.selection.value[id] === true) ids.push(id);
    }
    return ids;
  }

  get hasOneSelection() {
    return this.selectedIds.length === 1;
  }

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

  /* Drag and Drop State */

  isDraggable(node: NodeController<T>) {
    // todo
    return true;
  }

  isDragging(id: string) {
    return this.props.dnd.value.dragSourceId === id;
  }

  willReceiveDrop(id: string) {
    const { targetParentId, targetIndex } = this.props.dnd.value;
    return id === targetParentId && targetIndex === null;
  }

  dragStart(id: string) {
    const ids = this.isSelected(id) ? this.selectedIds : [id];
    this.props.dnd.onChange({
      type: "drag-start",
      dragSourceId: id,
      dragItems: ids,
    });
  }

  draggingOver(parentId: string | null, index: number | null) {
    this.props.dnd.onChange({
      type: "dragging-over",
      targetParentId: parentId,
      targetIndex: index,
    });
  }

  canDrop() {
    return safeToDrop(this);
  }

  drop() {
    const dnd = this.props.dnd.value;
    this.props.nodes.onChange({
      type: "move",
      sourceIds: dnd.dragItems,
      targetParentId: dnd.targetParentId,
      targetIndex: dnd.targetIndex || 0,
    });
  }

  dragEnd() {
    this.props.dnd.onChange({ type: "drag-end" });
    this.props.cursor.onChange({ value: null });
  }

  /* Drop Cursor State */

  showCursor(value: CursorState) {
    this.props.cursor.onChange({ value });
  }

  hideCursor() {
    this.props.cursor.onChange({ value: null });
  }

  /* Focus */

  isFocused(id: string) {
    return this.hasFocus && this.props.focus.value.id === id;
  }

  get hasFocus() {
    return this.props.focus.value.isWithinTree;
  }

  focus(id: string) {
    const node = this.get(id);
    if (node) {
      this.props.focus.onChange({ id, type: "node-focus" });
      this.scrollTo(node.rowIndex);
    }
  }

  onFocus() {
    this.props.focus.onChange({ type: "tree-focus" });
    this.focus(this.focusedNode?.id || this.firstNode?.id);
  }

  onBlur() {
    this.props.focus.onChange({ type: "tree-blur" });
  }

  /* Scroll Positions */

  scrollTo(index: number, align: Align = "smart") {
    this.listElement?.scrollToItem(index, align);
  }

  /* Visibility */

  isVisible(id: string) {
    if (id in this.props.visible.value) {
      return this.props.visible.value[id] === true;
    } else {
      return true; // default visible state
    }
  }

  /* Commands */
  exec(command: string) {
    if (command in this.props.commands) {
      return this.props.commands[command](this);
    } else {
      throw new Error(
        `Command not found: "${command}". To fix, ensure that you pass an object to the commands prop in the <TreeView /> component that has a key with then name "${command}"`,
      );
    }
  }

  /* Keyboard Shortcuts */
  handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const focused = this.focusedNode;
    const shortcut = new ShortcutManager<any>(this.props.shortcuts).find(
      e.nativeEvent,
      {
        isOpen: focused?.isOpen,
        isClosed: focused?.isClosed,
        isInternal: focused?.isInternal,
        isLeaf: focused?.isLeaf,
      },
    );
    console.log("focused Node", focused);
    if (shortcut) {
      e.preventDefault();
      this.exec(shortcut.command);
    }
  }
}
