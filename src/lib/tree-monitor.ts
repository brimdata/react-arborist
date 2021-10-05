// useImperativeHandle(
//   props.handle,
//   () => ({
//     selectedIds: state.selection.ids,
//     selectId: (id: string) => {
//       const node = staticValue.getNode(id);
//       if (node && node.rowIndex) {
//         dispatch(select(node.rowIndex, false, false));
//       } else {
//         dispatch(selectId(id));
//       }
//     },
//     edit: (id: string) => {
//       dispatch(edit(id));
//     },
//   }),
//   [staticValue, state.selection.ids]
// );

import { Dispatch } from "react";
import { Action, edit } from "./reducer";
import { StateContext } from "./types";

export class TreeMonitor {
  constructor(public state: StateContext, public dispatch: Dispatch<Action>) {}

  assign(state: StateContext, dispatch: Dispatch<Action>) {
    this.state = state;
    this.dispatch = dispatch;
  }

  getSelectedIds() {
    return this.state.selection.ids;
  }

  edit(id: string) {
    this.dispatch(edit(id));
  }
}
