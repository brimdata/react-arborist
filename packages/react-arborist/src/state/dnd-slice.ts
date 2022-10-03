import { Cursor } from "../dnd/compute-drop";
import { ActionTypes } from "../types/utils";
import { initialState } from "./initial";

/* Types */
export type DndState = { dragId: null | string; cursor: Cursor };

/* Actions */
export const actions = {
  cursor(cursor: Cursor) {
    return { type: "DND_CURSOR" as const, cursor };
  },
  dragStart(id: string) {
    return { type: "DND_DRAG_START" as const, id };
  },
  dragEnd() {
    return { type: "DND_DRAG_END" as const };
  },
};

/* Reducer */
export function reducer(
  state: DndState = initialState()["dnd"],
  action: ActionTypes<typeof actions>
) {
  switch (action.type) {
    case "DND_CURSOR":
      return { ...state, cursor: action.cursor };
    case "DND_DRAG_START":
      return { ...state, dragId: action.id };
    case "DND_DRAG_END":
      return { ...state, dragId: null };
    default:
      return state;
  }
}
