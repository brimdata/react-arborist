import { ActionTypes } from "../types/utils";
import { actions as dnd } from "./dnd-slice";

/* Types */

export type DragSlice = { id: string | null };

/* Actions */

/* Reducer */

export function reducer(
  state: DragSlice = { id: null },
  action: ActionTypes<typeof dnd>
) {
  switch (action.type) {
    case "DND_DRAG_START":
      return { ...state, id: action.id };
    case "DND_DRAG_END":
      return { ...state, id: null };
    default:
      return state;
  }
}
