import memoizeOne from "memoize-one";
import { Dispatch } from "react";
import { FixedSizeList } from "react-window";
import { flattenTree } from "./data/flatten-tree";
import { Action, actions } from "./reducer";
import { CursorLocation, Node, StateContext, TreeProviderProps } from "./types";

export class TreeApi<T = unknown> {
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

  edit(id: string | number | null) {
    this.dispatch(actions.edit(id ? id.toString() : null));
  }

  select(index: number | null, meta: boolean, shift: boolean) {
    this.dispatch(actions.select(index, meta, shift));
  }

  selectUpwards(shiftKey: boolean) {
    this.dispatch(actions.stepUp(shiftKey, this.visibleIds));
  }

  selectDownwards(shiftKey: boolean) {
    this.dispatch(actions.stepDown(shiftKey, this.visibleIds));
  }

  hideCursor() {
    this.dispatch(actions.setCursorLocation(null));
  }

  showCursor(location: CursorLocation) {
    this.dispatch(actions.setCursorLocation(location));
  }

  scrollToId(id: string) {
    if (!this.list) return;
    const index = this.idToIndex[id];
    if (index) {
      this.list.scrollToItem(index, "start");
    } else {
      this.openParents(id);
      // This appears to be synchronous
      // But I've only tested it in the console and
      // not in an event handler which will be batched...

      // We may need to wrap this in a timeout or trigger an effect somehow
      setTimeout(() => {
        const index = this.idToIndex[id];
        if (index) {
          this.list?.scrollToItem(index, "start");
        }
      });
    }
  }

  open(id: string) {
    this.props.onToggle(id, true);
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
    return createList(this.props.root);
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
