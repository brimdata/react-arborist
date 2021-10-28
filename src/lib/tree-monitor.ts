import { Dispatch, MutableRefObject } from "react";
import { FixedSizeList } from "react-window";
import { Action, edit } from "./reducer";
import { StateContext } from "./types";

// This is the only place we need to setup dispatch
// I think this should be called the tree api not the monitor
export class TreeMonitor {
  constructor(
    public state: StateContext,
    public dispatch: Dispatch<Action>,
    public list: MutableRefObject<FixedSizeList | undefined>
  ) {}

  assign(
    state: StateContext,
    dispatch: Dispatch<Action>,
    list: MutableRefObject<FixedSizeList | undefined>
  ) {
    this.state = state;
    this.dispatch = dispatch;
    this.list = list;
  }

  getSelectedIds() {
    return this.state.selection.ids;
  }

  edit(id: string) {
    this.dispatch(edit(id));
  }

  scrollToId(id: string, align?: "start" | "center" | "end") {
    // So I need the data in here
    // And I need on open handlers
    // const node = find(id);
    // openContainingParents(node)
    // const index = findIndex(node)
    // this.dispatch(scrollTo())
    // this.scrollToIndex(index)
  }

  scrollToIndex(index: number, align?: "start" | "center" | "end") {
    this.list.current?.scrollToItem(index, align);
  }

  scrollTo(scrollOffset: number) {
    this.list.current?.scrollTo(scrollOffset);
  }
}
