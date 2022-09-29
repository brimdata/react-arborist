import { Cursor } from "../dnd/compute-drop";

/* Types */
export type DndState = { cursor: Cursor };

/* Actions */
export function cursor(cursor: Cursor) {
  return { type: "CURSOR" as const, cursor };
}

/* Reducer */
export function reducer(
  state: DndState = { cursor: { type: "none" } as Cursor },
  action: ReturnType<typeof cursor>
) {
  if (action.type === "CURSOR") {
    return { ...state, cursor: action.cursor };
  } else {
    return state;
  }
}
