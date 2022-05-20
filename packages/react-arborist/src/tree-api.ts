import memoizeOne from "memoize-one";
import { Dispatch } from "react";
import { FixedSizeList } from "react-window";
import { flattenTree } from "./data/flatten-tree";
import { Cursor } from "./dnd/compute-drop";
import { Action, actions } from "./reducer";
import { Node, StateContext, TreeProviderProps, EditResult } from "./types";
import ReactDOM from "react-dom";
import { first, last } from "./utils";

export class TreeApi<T = unknown> {
  private edits = new Map<string, (args: EditResult) => void>();

  constructor(
    public dispatch: Dispatch<Action>,
    public state: StateContext,
    public props: TreeProviderProps<T>,
    public list: FixedSizeList | undefined
  ) {}

  assign(
    dispatch: Dispatch<Action>,
    state: StateContext,
    props: TreeProviderProps<T>,
    list: FixedSizeList | undefined
  ) {
    this.dispatch = dispatch;
    this.state = state;
    this.props = props;
    this.list = list;
  }

  getNode(id: string): Node<unknown> | null {
    if (id in this.idToIndex)
      return this.visibleNodes[this.idToIndex[id]] || null;
    else return null;
  }

  getSelectedIds() {
    return this.state.selection.ids;
  }

  edit(id: string | number): Promise<EditResult> {
    const sid = id.toString();
    this.resolveEdit(sid, { cancelled: true });
    this.scrollToId(sid);
    this.dispatch(actions.edit(sid));
    return new Promise((resolve) => this.edits.set(sid, resolve));
  }

  submit(id: string | number, value: string) {
    const sid = id.toString();
    this.props.onEdit(sid, value);
    this.dispatch(actions.edit(null));
    this.resolveEdit(sid, { cancelled: false, value });
  }

  reset(id: string | number) {
    const sid = id.toString();
    this.dispatch(actions.edit(null));
    this.resolveEdit(sid, { cancelled: true });
  }

  private resolveEdit(id: string, value: EditResult) {
    const resolve = this.edits.get(id.toString());
    if (resolve) resolve(value);
    this.edits.delete(id);
  }

  // Make this use an id
  select(index: number | null, meta = false, shift = false) {
    this.dispatch(actions.select(index, meta, shift));
  }

  // Change this to selectIndex
  selectById(id: string | number, meta = false, shift = false) {
    const index = this.idToIndex[id];
    this.select(index, meta, shift);
  }

  focus(id: string | null, shiftKey: boolean = false) {
    if (id === null) return;
    const selectionFollowsFocus = false;
    this.dispatch(actions.focus(id));
    if (shiftKey || selectionFollowsFocus) {
      this.selectById(id, false, shiftKey);
    }
  }

  focusNext(shiftKey: boolean) {
    const id = this.state.focusId;
    const nextId = id && this.getNextId(id);
    if (!id) this.focusFirst();
    else if (nextId) this.focus(nextId, shiftKey);
  }

  focusPrev(shiftKey: boolean) {
    const id = this.state.focusId;
    const prevId = id && this.getPrevId(id);
    if (!id) this.focusLast();
    else if (prevId) this.focus(prevId, shiftKey);
  }

  focusFirst(shiftKey: boolean = false) {
    this.focus(first(this.visibleIds), shiftKey);
  }

  focusLast(shiftKey: boolean = false) {
    this.focus(last(this.visibleIds), shiftKey);
  }

  hideCursor() {
    this.dispatch(actions.setCursorLocation({ type: "none" }));
  }

  showCursor(cursor: Cursor) {
    this.dispatch(actions.setCursorLocation(cursor));
  }

  scrollToId(id: string) {
    if (!this.list) return;
    const index = this.idToIndex[id];
    if (index) {
      this.list.scrollToItem(index);
    } else {
      this.openParents(id);
      ReactDOM.flushSync(() => {
        const index = this.idToIndex[id];
        if (index) {
          this.list?.scrollToItem(index);
        }
      });
    }
  }

  open(id: string) {
    this.props.onToggle(id, true);
  }

  close(id: string) {
    this.props.onToggle(id, false);
  }

  openParents(id: string) {
    const node = dfs(this.props.root, id);
    let parent = node?.parent;

    while (parent) {
      this.open(parent.id);
      parent = parent.parent;
    }
  }

  openLevel(level: number) {
    const nodes = this.visibleNodes.filter((n) => n.level === level);
    for (let node of nodes) this.open(node.id);
  }

  get visibleIds() {
    return getIds(this.visibleNodes);
  }

  get idToIndex() {
    return createIndex(this.visibleNodes);
  }

  get visibleNodes() {
    return createList(this.props.root);
  }

  private getId(index: number) {
    if (index >= this.visibleIds.length) return null;
    return this.visibleIds[index] || null;
  }

  private getNextId(id: string) {
    if (!(id in this.idToIndex)) return null;
    const index = this.idToIndex[id];
    return this.getId(index + 1);
  }

  private getPrevId(id: string) {
    if (!(id in this.idToIndex)) return null;
    const index = this.idToIndex[id];
    return this.getId(index - 1);
  }
}

const getIds = memoizeOne((nodes: Node[]) => nodes.map((n) => n.id));
const createIndex = memoizeOne((nodes: Node[]) => {
  return nodes.reduce<{ [id: string]: number }>((map, node, index) => {
    map[node.id] = index;
    return map;
  }, {});
});
const createList = memoizeOne(flattenTree);

function dfs(node: Node<unknown>, id: string): Node<unknown> | null {
  if (!node) return null;
  if (node.id === id) return node;
  if (node.children) {
    for (let child of node.children) {
      const result = dfs(child, id);
      if (result) return result;
    }
  }
  return null;
}
