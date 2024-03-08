import { Cursor } from "../dnd/compute-drop";
import { ActionTypes } from "../types/utils";
import { initialState } from "./initial";

/* Types */
export type DndState = {
  dragId: null | string;
  cursor: Cursor;
  dragIds: string[];
  parentId: null | string;
  index: number | null;
};

/* Actions */
export const actions = {
  cursor(cursor: Cursor) {
    return { type: "DND_CURSOR" as const, cursor };
  },
  dragStart(id: string, dragIds: string[]) {
    return { type: "DND_DRAG_START" as const, id, dragIds };
  },
  dragEnd() {
    return { type: "DND_DRAG_END" as const };
  },
  hovering(parentId: string | null, index: number | null) {
    return { type: "DND_HOVERING" as const, parentId, index };
  },
};

/* Reducer */
export function reducer(
  state: DndState = initialState()["dnd"],
  action: ActionTypes<typeof actions>
): DndState {
  switch (action.type) {
    case "DND_CURSOR":
      return { ...state, cursor: action.cursor };
    case "DND_DRAG_START":
      return { ...state, dragId: action.id, dragIds: action.dragIds };
    case "DND_DRAG_END":
      return initialState()["dnd"];
    case "DND_HOVERING":
      return { ...state, parentId: action.parentId, index: action.index };
    default:
      return state;
  }
}
