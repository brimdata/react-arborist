import { ActionTypes } from "../types/utils";
import { actions as dnd } from "./dnd-slice";

/* Types */

export type DragSlice = { id: string | null; idWillReceiveDrop: string | null };

/* Reducer */

export function reducer(
  state: DragSlice = { id: null, idWillReceiveDrop: null },
  action: ActionTypes<typeof dnd>
) {
  switch (action.type) {
    case "DND_DRAG_START":
      return { ...state, id: action.id };
    case "DND_DRAG_END":
      return { ...state, id: null };
    case "DND_CURSOR":
      const c = action.cursor;
      if (c.type === "highlight" && c.id !== state.idWillReceiveDrop) {
        return { ...state, idWillReceiveDrop: c.id };
      } else if (c.type !== "highlight" && state.idWillReceiveDrop !== null) {
        return { ...state, idWillReceiveDrop: null };
      } else {
        return state;
      }
    default:
      return state;
  }
}
