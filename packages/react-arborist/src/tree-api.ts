import memoizeOne from "memoize-one";
import { Dispatch, MutableRefObject } from "react";
import { FixedSizeList } from "react-window";
import { flattenTree } from "./data/flatten-tree";
import { Cursor } from "./dnd/compute-drop";
import { Action, actions } from "./reducer";
import {
  Node,
  StateContext,
  TreeProviderProps,
  EditResult,
  IdObj,
  DropCursorProps,
} from "./types";
import ReactDOM from "react-dom";
import { noop } from "./utils";
import { Selection } from "./selection/selection";
import { defaultDropCursor } from "./components/default-drop-cursor";
export class TreeApi<T extends IdObj> {
  private edits = new Map<string, (args: EditResult) => void>();

  constructor(
    public dispatch: Dispatch<Action>,
    public state: StateContext,
    public props: TreeProviderProps<T>,
    public list: MutableRefObject<FixedSizeList | null>,
    public listEl: MutableRefObject<HTMLDivElement | null>
  ) {}

  sync(other: TreeApi<T>) {
    this.dispatch = other.dispatch;
    this.state = other.state;
    this.props = other.props;
    this.list = other.list;
    this.listEl = other.listEl;
  }

  getNode(id: string): Node<T> | null {
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
    this.onEdit(sid, value);
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

  select(index: number | null, meta = false, shift = false) {
    this.dispatch(actions.select(index, meta, shift));
  }

  selectById(id: string | number, meta = false, shift = false) {
    const index = this.idToIndex[id];
    this.select(index, meta, shift);
  }

  selectUpwards(shiftKey: boolean) {
    this.dispatch(actions.stepUp(shiftKey, this.visibleIds));
  }

  selectDownwards(shiftKey: boolean) {
    this.dispatch(actions.stepDown(shiftKey, this.visibleIds));
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

  open(id: string) {
    this.onToggle(id, true);
  }

  openParents(id: string) {
    const node = dfs(this.props.root, id);
    let parent = node?.parent;

    while (parent) {
      this.open(parent.id);
      parent = parent.parent;
    }
  }

  get visibleIds() {
    return getIds(this.visibleNodes);
  }

  get idToIndex() {
    return createIndex(this.visibleNodes);
  }

  get visibleNodes() {
    return createList(this.props.root) as Node<T>[];
  }

  get width() {
    return this.props.treeProps.width || 300;
  }

  get height() {
    return this.props.treeProps.height || 500;
  }

  get indent() {
    return this.props.treeProps.indent || 24;
  }

  get renderer() {
    return this.props.treeProps.children;
  }

  get onToggle() {
    return this.props.treeProps.onToggle || noop;
  }

  get rowHeight() {
    return this.props.treeProps.rowHeight || 24;
  }

  get onClick() {
    return this.props.treeProps.onClick || noop;
  }

  get onContextMenu() {
    return this.props.treeProps.onContextMenu || noop;
  }

  get onMove() {
    return this.props.treeProps.onMove || noop;
  }

  get onEdit() {
    return this.props.treeProps.onEdit || noop;
  }

  get cursorParentId() {
    const { cursor } = this.state;
    switch (cursor.type) {
      case "highlight":
        return cursor.id;
      default:
        return null;
    }
  }

  get cursorOverFolder() {
    return this.state.cursor.type === "highlight";
  }

  get editingId() {
    return this.state.editingId;
  }

  isSelected(index: number | null) {
    const selection = Selection.parse(this.state.selection.data, []);
    return selection.contains(index);
  }

  renderDropCursor(props: DropCursorProps) {
    const render = this.props.treeProps.dropCursor || defaultDropCursor;
    return render(props);
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
