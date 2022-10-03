import {
  MoveHandler,
  RenameHandler,
  CreateHandler,
  EditResult,
} from "../types/handlers";
import { IdObj } from "../types/utils";
import { TreeProps } from "../types/tree-props";
import { Dispatch, MutableRefObject } from "react";
import { FixedSizeList } from "react-window";
import { Cursor } from "../dnd/compute-drop";
import ReactDOM from "react-dom";
import {
  access,
  createIndex,
  createList,
  dfs,
  getIds,
  identify,
  identifyNull,
  noop,
} from "../utils";
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

export class TreeApi<T extends IdObj> {
  root: NodeApi<T>;
  private edits = new Map<string, (args: EditResult) => void>();

  constructor(
    public dispatch: Dispatch<Actions>,
    public state: RootState,
    public props: TreeProps<T>,
    public list: MutableRefObject<FixedSizeList | null>,
    public listEl: MutableRefObject<HTMLDivElement | null>
  ) {
    this.root = createRoot<T>(this);
  }

  sync(state: TreeApi<T>["state"]) {
    this.state = state;
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

  indexOf(id: string | null | IdObj) {
    const key = identifyNull(id);
    if (!key) return null;
    return this.idToIndex[key];
  }

  getSelectedIds() {
    return this.state.nodes.selection.ids;
  }

  /* Data Operations */

  async newLeafNode() {
    let index;
    let parentId;
    if (this.focusedNode && this.focusedNode.parent) {
      index = this.focusedNode.childIndex + 1;
      parentId = this.focusedNode.parent.id;
    } else {
      index = this.root?.children?.length || -1;
      parentId = this.root.id;
    }
    const data = await this.onCreate({ parentId, index });
    if (data) {
      // At this point, the data has changed
      this.select(data);
      this.focus(data);
      setTimeout(() => this.edit(data));
    }
  }

  onCreate(...args: Parameters<CreateHandler>) {
    const fn = this.props.onCreate || noop;
    return fn(...args);
  }

  move(...args: Parameters<MoveHandler>) {
    const fn = this.props.onMove || noop;
    return fn(...args);
  }

  rename(...args: Parameters<RenameHandler>) {
    const fn = this.props.onRename || noop;
    return fn(...args);
  }

  edit(node: string | IdObj): Promise<EditResult> {
    const id = identify(node);
    this.resolveEdit(id, { cancelled: true });
    this.scrollToId(id);
    this.dispatch(edit(id));
    return new Promise((resolve) => this.edits.set(id, resolve));
  }

  submit(id: string, value: string) {
    this.rename({ id, name: value });
    this.dispatch(edit(null));
    this.resolveEdit(id, { cancelled: false, value });
    setTimeout(() => this.onFocus()); // Return focus to element;
  }

  reset(id: string) {
    this.dispatch(edit(null));
    this.resolveEdit(id, { cancelled: true });
    setTimeout(() => this.onFocus()); // Return focus to element;
  }

  private resolveEdit(id: string, value: EditResult) {
    const resolve = this.edits.get(id.toString());
    if (resolve) resolve(value);
    this.edits.delete(id);
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

  select(
    node: string | null | IdObj,
    opts: { multi?: boolean; contiguous?: boolean } = {}
  ) {
    const id = identifyNull(node);
    const { anchor, mostRecent } = this.state.nodes.selection;
    if (id === null) {
      this.dispatch(selection.clear());
      this.dispatch(selection.anchor(null));
    } else if (opts.contiguous) {
      this.dispatch(selection.remove(this.nodesBetween(anchor, mostRecent)));
      this.dispatch(selection.add(this.nodesBetween(anchor, identifyNull(id))));
    } else if (opts.multi) {
      const node = this.get(id);
      if (node?.isSelected) {
        this.dispatch(selection.remove(id));
        // Maybe change the anchor (Finder does this)
      } else {
        this.dispatch(selection.add(id));
        this.dispatch(selection.anchor(id));
      }
    } else {
      this.dispatch(selection.only(id));
      this.dispatch(selection.anchor(id));
    }
    this.dispatch(selection.mostRecent(id));
  }

  selectAll() {
    this.dispatch(selection.set(new Set(Object.keys(this.idToIndex))));
    this.focus(this.firstNode);
    this.dispatch(selection.anchor(this.firstNode));
    this.dispatch(selection.mostRecent(this.lastNode));
  }

  activate(node: NodeApi<T>) {
    // const fn = this.props.onActivate;
    // if (fn) fn(node);
  }

  hideCursor() {
    this.dispatch(dnd.cursor({ type: "none" }));
  }

  showCursor(cursor: Cursor) {
    this.dispatch(dnd.cursor(cursor));
  }

  scrollToId(id: string) {
    if (!this.list) return;
    const index = this.idToIndex[id];
    if (index) {
      this.list.current?.scrollToItem(index);
    } else {
      this.openParents(id);
      ReactDOM.flushSync(() => {
        // need to remove this
        const index = this.idToIndex[id];
        if (index) {
          this.list.current?.scrollToItem(index);
        }
      });
    }
  }

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
    const node = dfs(this.root, id);
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

  get visibleIds() {
    return getIds(this.visibleNodes);
  }

  get idToIndex(): { [id: string]: number } {
    // @ts-ignore
    return createIndex(this.visibleNodes);
  }

  get visibleNodes(): NodeApi<T>[] {
    // @ts-ignore
    return createList(this.root);
  }

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

  get onClick() {
    return this.props.onClick || noop;
  }

  get onContextMenu() {
    return this.props.onContextMenu || noop;
  }

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

  get editingId() {
    return this.state.nodes.edit.id;
  }

  /* State Checks */

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
    return !access(data, check) ?? true;
  }

  isDroppable(data: T) {
    const check = this.props.disableDrop || (() => false);
    return !access(data, check) ?? true;
  }

  isDragging(node: string | IdObj | null) {
    const id = identifyNull(node);
    if (!id) return false;
    return this.state.nodes.drag.id === id;
  }

  willReceiveDrop(node: string | IdObj | null) {
    const id = identifyNull(node);
    if (!id) return false;
    const cursor = this.state.dnd.cursor;
    return cursor.type === "highlight" && cursor.id === id;
  }

  getChildren(data: T) {
    const get = this.props.getChildren || "children";
    return access<T[] | undefined>(data, get) ?? null;
  }

  /* Focus Methods */

  focus(id?: string | IdObj | null) {
    if (!id) return;
    this.dispatch(focus(identify(id)));
  }

  onFocus() {
    const node = this.focusedNode || this.firstNode;
    this.focus(node);
    if (this.props.selectionFollowsFocus) this.select(node);
  }

  onBlur() {
    this.dispatch(treeBlur());
  }

  /* Getters */

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

  /* Tree State Checks */

  get isEditing() {
    return this.state.nodes.edit.id !== null;
  }

  /* Node State Checks */
  isFocused(id: string) {
    return (
      this.state.nodes.focus.treeFocused && this.state.nodes.focus.id === id
    );
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
