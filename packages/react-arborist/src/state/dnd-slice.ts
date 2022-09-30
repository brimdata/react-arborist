import { Cursor } from "../dnd/compute-drop";
import { ActionTypes } from "../types/utils";
import { initialState } from "./initial";

/* Types */
export type DndState = { cursor: Cursor };

/* Actions */
export const actions = {
  cursor(cursor: Cursor) {
    return { type: "CURSOR" as const, cursor };
  },
};

/* Reducer */
export function reducer(
  state: DndState = initialState()["dnd"],
  action: ActionTypes<typeof actions>
) {
  if (action.type === "CURSOR") {
    return { ...state, cursor: action.cursor };
  } else {
    return state;
  }
}
