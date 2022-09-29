import { Dispatch, MutableRefObject } from "react";
import { FixedSizeList } from "react-window";
import { Cursor } from "./dnd/compute-drop";
import { EditResult, IdObj, DropCursorProps, TreeProps } from "./types";
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
} from "./utils";
import { defaultDropCursor } from "./components/default-drop-cursor";
import { DefaultRow } from "./components/default-row";
import { DefaultNode } from "./components/default-node";
import { NodeInterface } from "./node-interface";
import { edit } from "./state/edit-slice";
import { Actions, RootState } from "./state/root-reducer";
import { focus, treeBlur } from "./state/focus-slice";
import { createRoot } from "./data/create-root";
import { open, close } from "./state/open-slice";
import { actions as selection } from "./state/selection-slice";
export class TreeApi<T extends IdObj> {
  root: NodeInterface<T>;
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

  sync(other: TreeApi<T>) {
    this.dispatch = other.dispatch;
    this.state = other.state;
    this.props = other.props;
    this.list = other.list;
    this.listEl = other.listEl;
  }

  get(id: string | null): NodeInterface<T> | null {
    if (!id) return null;
    if (id in this.idToIndex)
      return this.visibleNodes[this.idToIndex[id]] || null;
    else return null;
  }

  at(index: number): NodeInterface<T> | null {
    return this.visibleNodes[index] || null;
  }

  indexOf(id: string | null | IdObj) {
    const key = identifyNull(id);
    if (!key) return null;
    return this.idToIndex[key];
  }

  getSelectedIds() {
    return this.state.selection.ids;
  }

  edit(id: string): Promise<EditResult> {
    this.resolveEdit(id, { cancelled: true });
    this.scrollToId(id);
    this.dispatch(edit(id));
    return new Promise((resolve) => this.edits.set(id, resolve));
  }

  submit(id: string, value: string) {
    this.onEdit(id, value);
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
    id: string | null | IdObj,
    opts: { multi?: boolean; contiguous?: boolean } = {}
  ) {
    const node = this.get(identifyNull(id));
    const { anchor, mostRecent } = this.state.selection;

    if (node === null) {
      this.dispatch(selection.clear());
      this.dispatch(selection.anchor(null));
    } else if (opts.contiguous) {
      this.dispatch(selection.remove(this.nodesBetween(anchor, mostRecent)));
      this.dispatch(selection.add(this.nodesBetween(anchor, identifyNull(id))));
    } else if (opts.multi) {
      if (node.isSelected) {
        this.dispatch(selection.remove(node));
        // Maybe change the anchor (Finder does this)
      } else {
        this.dispatch(selection.add(node));
        this.dispatch(selection.anchor(node));
      }
    } else {
      this.dispatch(selection.only(node));
      this.dispatch(selection.anchor(node));
    }
    this.dispatch(selection.mostRecent(id));
  }

  selectAll() {
    this.dispatch(selection.set(new Set(Object.keys(this.idToIndex))));
    this.focus(this.firstNode);
    this.dispatch(selection.anchor(this.firstNode));
    this.dispatch(selection.mostRecent(this.lastNode));
  }

  activate(node: NodeInterface<T>) {
    const fn = this.props.onActivate;
    if (fn) fn(node);
  }

  hideCursor() {
    // this.dispatch(actions.setCursorLocation({ type: "none" }));
  }

  showCursor(cursor: Cursor) {
    // this.dispatch(actions.setCursorLocation(cursor));
  }

  scrollToId(id: string) {
    if (!this.list) return;
    const index = this.idToIndex[id];
    if (index) {
      this.list.current?.scrollToItem(index);
    } else {
      this.openParents(id);
      ReactDOM.flushSync(() => {
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

  openSiblings(node: NodeInterface<T>) {
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

  get visibleNodes(): NodeInterface<T>[] {
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

  get renderer() {
    return this.props.children || DefaultNode;
  }

  get rowRenderer() {
    return this.props.rowRenderer || DefaultRow;
  }

  get onToggle() {
    return this.props.onToggle || noop;
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

  get onMove() {
    return this.props.onMove || noop;
  }

  get onEdit() {
    return this.props.onEdit || noop;
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
    return this.state.edit.id;
  }

  /* State Checks */

  isSelected(id?: string) {
    if (!id) return false;
    return this.state.selection.ids.has(id);
  }

  isOpen(id?: string) {
    if (!id) return false;
    return this.state.open[id] ?? this.props.openByDefault ?? true;
  }

  isDraggable(data: T) {
    const check = this.props.disableDrag || (() => false);
    return !access(data, check) ?? true;
  }

  isDroppable(data: T) {
    const check = this.props.disableDrop || (() => false);
    return !access(data, check) ?? true;
  }

  getChildren(data: T) {
    const get = this.props.getChildren || "children";
    return access<T[] | undefined>(data, get) ?? null;
  }

  renderDropCursor(props: DropCursorProps) {
    const render = this.props.dropCursor || defaultDropCursor;
    return render(props);
  }

  /* Focus Methods */

  get focusedId() {
    return this.state.focus.id;
  }

  focus(id?: string | IdObj | null) {
    if (!id) return;
    else this.dispatch(focus(identify(id)));
  }

  focusNext() {
    if (!this.focusedId) {
      this.focus(this.firstNode?.id);
    } else {
      const index = this.visibleIds.indexOf(this.focusedId);
      const id = this.visibleIds[index + 1];
      if (!id) return null;
      this.focus(id);
    }
  }

  focusPrev() {
    if (!this.focusedId) {
      this.focus(this.lastNode?.id);
    } else {
      const index = this.visibleIds.indexOf(this.focusedId);
      const id = this.visibleIds[index - 1];
      if (!id) return;
      this.focus(id);
    }
  }

  onFocus() {
    const node = this.get(this.focusedId) || this.firstNode;
    this.focus(node?.id);
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
    return this.get(this.state.focus.id) ?? null;
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
    return this.state.edit.id !== null;
  }

  /* Node State Checks */
  isFocused(id: string) {
    return this.state.focus.treeFocused && this.focusedId === id;
  }
}
