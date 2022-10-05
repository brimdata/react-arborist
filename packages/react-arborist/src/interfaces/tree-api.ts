import { EditResult } from "../types/handlers";
import { Identity, IdObj } from "../types/utils";
import { TreeProps } from "../types/tree-props";
import { Dispatch, MutableRefObject } from "react";
import { FixedSizeList } from "react-window";
import * as utils from "../utils";
import { DefaultCursor } from "../components/default-cursor";
import { DefaultRow } from "../components/default-row";
import { DefaultNode } from "../components/default-node";
import { NodeApi } from "./node-api";
import { edit } from "../state/edit-slice";
import { Actions, RootState } from "../state/root-reducer";
import { focus, treeBlur } from "../state/focus-slice";
import { createRoot } from "../data/create-root";
import { open, close } from "../state/open-slice";
import { actions as selection } from "../state/selection-slice";
import { actions as dnd } from "../state/dnd-slice";
import { DefaultDragPreview } from "../components/default-drag-preview";
import { DefaultContainer } from "../components/default-container";
import { Cursor } from "../dnd/compute-drop";
import { Store } from "redux";

const { safeRun, identify, identifyNull } = utils;
export class TreeApi<T extends IdObj> {
  root: NodeApi<T>;
  private edits = new Map<string, (args: EditResult) => void>();

  constructor(
    public store: Store<RootState, Actions>,
    public props: TreeProps<T>,
    public list: MutableRefObject<FixedSizeList | null>,
    public listEl: MutableRefObject<HTMLDivElement | null>
  ) {
    this.root = createRoot<T>(this);
  }

  /* Store helpers */

  dispatch(action: Actions) {
    return this.store.dispatch(action);
  }

  get state() {
    return this.store.getState();
  }

  /* Tree Props */

  get width() {
    return this.props.width || 300;
  }

  get height() {
    return this.props.height || 500;
  }

  get indent() {
    return this.props.indent || 24;
  }

  get rowHeight() {
    return this.props.rowHeight || 24;
  }

  getChildren(data: T) {
    const get = this.props.getChildren || "children";
    return utils.access<T[] | undefined>(data, get) ?? null;
  }

  /* Node Access */

  get idToIndex(): { [id: string]: number } {
    return utils.createIndex(this.visibleNodes as unknown as NodeApi<IdObj>[]);
  }

  get visibleNodes(): NodeApi<T>[] {
    return utils.createList(
      this.root as unknown as NodeApi<IdObj>
    ) as unknown as NodeApi<T>[];
  }

  get visibleIds() {
    return utils.getIds(this.visibleNodes);
  }

  get firstNode() {
    return this.visibleNodes[0] ?? null;
  }

  get lastNode() {
    return this.visibleNodes[this.visibleNodes.length - 1] ?? null;
  }

  get focusedNode() {
    return this.get(this.state.nodes.focus.id) ?? null;
  }

  get nextNode() {
    const index = this.indexOf(this.focusedNode);
    if (index === null) return null;
    else return this.at(index + 1);
  }

  get prevNode() {
    const index = this.indexOf(this.focusedNode);
    if (index === null) return null;
    else return this.at(index - 1);
  }

  get(id: string | null): NodeApi<T> | null {
    if (!id) return null;
    if (id in this.idToIndex)
      return this.visibleNodes[this.idToIndex[id]] || null;
    else return null;
  }

  at(index: number): NodeApi<T> | null {
    return this.visibleNodes[index] || null;
  }

  nodesBetween(startId: string | null, endId: string | null) {
    if (startId === null || endId === null) return [];
    const index1 = this.indexOf(startId) ?? 0;
    const index2 = this.indexOf(endId);
    if (index2 === null) return [];
    const start = Math.min(index1, index2);
    const end = Math.max(index1, index2);
    return this.visibleNodes.slice(start, end + 1);
  }

  indexOf(id: string | null | IdObj) {
    const key = utils.identifyNull(id);
    if (!key) return null;
    return this.idToIndex[key];
  }

  /* Data Operations */

  get editingId() {
    return this.state.nodes.edit.id;
  }

  async createLeaf() {
    let index;
    let parentId;
    if (this.focusedNode && this.focusedNode.parent) {
      index = this.focusedNode.childIndex + 1;
      parentId = this.focusedNode.parent.id;
    } else {
      index = this.root?.children?.length || -1;
      parentId = this.root.id;
    }
    const data = await safeRun(this.props.onCreate, { parentId, index });
    if (data) {
      // At this point, the data has changed
      this.selectOne(data);
      setTimeout(() => this.edit(data));
    }
  }

  async delete(node: string | IdObj | null) {
    if (!node) return;
    const id = identify(node);
    await safeRun(this.props.onDelete, { id });
  }

  edit(node: string | IdObj): Promise<EditResult> {
    const id = identify(node);
    this.resolveEdit(id, { cancelled: true });
    this.scrollTo(id);
    this.dispatch(edit(id));
    return new Promise((resolve) => this.edits.set(id, resolve));
  }

  async submit(id: string, value: string) {
    await safeRun(this.props.onRename, { id, name: value });
    this.dispatch(edit(null));
    this.resolveEdit(id, { cancelled: false, value });
    setTimeout(() => this.onFocus()); // Return focus to element;
  }

  reset(id: string) {
    this.dispatch(edit(null));
    this.resolveEdit(id, { cancelled: true });
    setTimeout(() => this.onFocus()); // Return focus to element;
  }

  activate(id: string | IdObj | null) {
    const node = this.get(identifyNull(id));
    if (!node) return;
    safeRun(this.props.onActivate, node.data);
  }

  preview(id: string | IdObj | null) {
    const node = this.get(identifyNull(id));
    if (!node) return;
    safeRun(this.props.onPreview, node.data);
  }

  private resolveEdit(id: string, value: EditResult) {
    const resolve = this.edits.get(id.toString());
    if (resolve) resolve(value);
    this.edits.delete(id);
  }

  /* Focus and Selection */

  get selectedIds() {
    return this.state.nodes.selection.ids;
  }

  get selectedData() {
    return Array.from(this.state.nodes.selection.ids)
      .map((id) => this.get(id)?.data)
      .filter((data) => !!data) as T[];
  }

  focus(node: Identity, opts: { scroll?: boolean } = {}) {
    if (!node) return;
    /* Focus is responsible for scrolling, while selection is
     * responsible for focus. If selectionFollowsFocus, then
     * just select it. */
    if (this.props.selectionFollowsFocus) {
      this.selectOne(node);
    } else {
      this.dispatch(focus(identify(node)));
      if (opts.scroll !== false) this.scrollTo(node);
    }
  }

  selectOne(node: Identity) {
    console.log("Select One");
    if (!node) return;
    const id = identify(node);
    this.dispatch(focus(id));
    this.scrollTo(id);
    this.dispatch(selection.only(id));
    this.dispatch(selection.anchor(id));
    this.dispatch(selection.mostRecent(id));
    safeRun(this.props.onSelect, this.selectedData);
  }

  selectMulti(identity: Identity) {
    const node = this.get(identifyNull(identity));
    if (!node) return;
    this.dispatch(focus(node.id));
    this.scrollTo(node);
    if (node.isSelected) {
      this.dispatch(selection.remove(node.id));
    } else {
      this.dispatch(selection.add(node.id));
      this.dispatch(selection.anchor(node.id));
    }
    this.dispatch(selection.mostRecent(node.id));
    safeRun(this.props.onSelect, this.selectedData);
  }

  selectContiguous(identity: Identity) {
    if (!identity) return;
    const id = identify(identity);
    const { anchor, mostRecent } = this.state.nodes.selection;
    this.dispatch(focus(id));
    this.scrollTo(id);
    this.dispatch(selection.remove(this.nodesBetween(anchor, mostRecent)));
    this.dispatch(selection.add(this.nodesBetween(anchor, identifyNull(id))));
    safeRun(this.props.onSelect, this.selectedData);
  }

  selectNone() {
    this.dispatch(selection.clear());
    this.dispatch(selection.anchor(null));
    this.dispatch(selection.mostRecent(null));
    safeRun(this.props.onSelect, this.selectedData);
  }

  selectAll() {
    this.dispatch(selection.set(new Set(Object.keys(this.idToIndex))));
    this.dispatch(focus(this.lastNode?.id));
    this.dispatch(selection.anchor(this.firstNode));
    this.dispatch(selection.mostRecent(this.lastNode));
    safeRun(this.props.onSelect, this.selectedData);
  }

  /* Drag and Drop */

  get cursorParentId() {
    const { cursor } = this.state.dnd;
    switch (cursor.type) {
      case "highlight":
        return cursor.id;
      default:
        return null;
    }
  }

  get cursorOverFolder() {
    return this.state.dnd.cursor.type === "highlight";
  }

  hideCursor() {
    this.dispatch(dnd.cursor({ type: "none" }));
  }

  showCursor(cursor: Cursor) {
    this.dispatch(dnd.cursor(cursor));
  }

  /* Visibility */

  open(id: string | null) {
    if (!id) return;
    this.dispatch(open(id));
  }

  close(id: string | null) {
    if (!id) return;
    this.dispatch(close(id));
  }

  toggle(id: string | null) {
    if (!id) return;
    return this.isOpen(id) ? this.close(id) : this.open(id);
  }

  openParents(id: string) {
    const node = utils.dfs(this.root, id);
    let parent = node?.parent;

    while (parent) {
      this.open(parent.id);
      parent = parent.parent;
    }
  }

  openSiblings(node: NodeApi<T>) {
    const parent = node.parent;
    if (!parent) {
      this.toggle(node.id);
    } else if (parent.children) {
      for (let sibling of parent.children) {
        if (sibling.isInternal) {
          node.isOpen ? this.close(sibling.id) : this.open(sibling.id);
        }
      }
    }
  }

  /* Scrolling */

  scrollTo(identity: Identity) {
    if (!identity) return;
    const id = identify(identity);
    const index = this.idToIndex[id];
    if (index === undefined) return;
    this.list.current?.scrollToItem(index);
  }

  /* State Checks */

  get isEditing() {
    return this.state.nodes.edit.id !== null;
  }

  isSelected(id?: string) {
    if (!id) return false;
    return this.state.nodes.selection.ids.has(id);
  }

  isOpen(id?: string) {
    if (!id) return false;
    return this.state.nodes.open[id] ?? this.props.openByDefault ?? true;
  }

  isDraggable(data: T) {
    const check = this.props.disableDrag || (() => false);
    return !utils.access(data, check) ?? true;
  }

  isDroppable(data: T) {
    const check = this.props.disableDrop || (() => false);
    return !utils.access(data, check) ?? true;
  }

  isDragging(node: string | IdObj | null) {
    const id = identifyNull(node);
    if (!id) return false;
    return this.state.nodes.drag.id === id;
  }

  isFocused(id: string) {
    return (
      this.state.nodes.focus.treeFocused && this.state.nodes.focus.id === id
    );
  }

  willReceiveDrop(node: string | IdObj | null) {
    const id = identifyNull(node);
    if (!id) return false;
    const cursor = this.state.dnd.cursor;
    return cursor.type === "highlight" && cursor.id === id;
  }

  /* Tree Event Handlers */

  onFocus() {
    const node = this.focusedNode || this.firstNode;
    this.focus(node);
  }

  onBlur() {
    this.dispatch(treeBlur());
  }

  /* Get Renderers */

  get renderContainer() {
    return this.props.renderContainer || DefaultContainer;
  }

  get renderRow() {
    return this.props.renderRow || DefaultRow;
  }

  get renderNode() {
    return this.props.children || DefaultNode;
  }

  get renderDragPreview() {
    return this.props.renderDragPreview || DefaultDragPreview;
  }

  get renderCursor() {
    return this.props.renderCursor || DefaultCursor;
  }
}
