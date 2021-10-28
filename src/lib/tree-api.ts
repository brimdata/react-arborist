import memoizeOne from "memoize-one";
import { Dispatch } from "react";
import { FixedSizeList } from "react-window";
import { flattenTree } from "./data/flatten-tree";
import { Action, actions } from "./reducer";
import { CursorLocation, Node, StateContext } from "./types";

export class TreeApi<T> {
  constructor(
    public dispatch: Dispatch<Action>,
    public state: StateContext,
    public root: Node<T>,
    public list: FixedSizeList | undefined
  ) {}

  assign(state: StateContext, root: Node<T>, list: FixedSizeList | undefined) {
    this.state = state;
    this.root = root;
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

  edit(id: string | null) {
    this.dispatch(actions.edit(id));
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

  scrollToId(id: string | number) {
    if (!this.list) return;
    const index = this.idToIndex[id.toString()];
    if (index) {
      this.list.scrollToItem(index, "start");
    } else {
      // The id is not visible at the moment
      // Find the id in the tree, open all the parents,
      // Then scroll to it
      console.log("No id found");
    }
  }

  get visibleIds() {
    return getIds(this.visibleNodes);
  }

  get idToIndex() {
    return createIndex(this.visibleNodes);
  }

  get visibleNodes() {
    return createList(this.root);
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
