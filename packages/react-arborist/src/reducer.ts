import { Cursor } from "./dnd/compute-drop";
import { Selection } from "./selection/selection";
import { StateContext } from "./types";

export const initState = (): StateContext => ({
  visibleIds: [],
  cursor: { type: "none" } as Cursor,
  editingId: null,
  focusId: null,
  selection: {
    data: null,
    ids: [],
  },
});

export const actions = {
  setCursorLocation: (cursor: Cursor) => ({
    type: "SET_CURSOR_LOCATION" as "SET_CURSOR_LOCATION",
    cursor,
  }),

  setVisibleIds: (
    ids: string[], // index to id
    idMap: { [id: string]: number } // id to index
  ) => ({
    type: "SET_VISIBLE_IDS" as "SET_VISIBLE_IDS",
    ids,
    idMap,
  }),

  select: (index: number | null, meta: boolean, shift: boolean) => ({
    type: "SELECT" as "SELECT",
    index,
    meta,
    shift,
  }),

  edit: (id: string | null) => ({
    type: "EDIT" as "EDIT",
    id,
  }),

  focus: (id: string | null) => ({
    type: "FOCUS" as "FOCUS",
    id,
  }),
};

type ActionObj = {
  [Prop in keyof typeof actions]: ReturnType<typeof actions[Prop]>;
};
export type Action = ActionObj[keyof ActionObj];

export function reducer(state: StateContext, action: Action): StateContext {
  switch (action.type) {
    case "EDIT":
      return {
        ...state,
        editingId: action.id,
      };
    case "SET_CURSOR_LOCATION":
      if (equal(state.cursor, action.cursor)) {
        return state;
      } else {
        return { ...state, cursor: action.cursor };
      }
    case "SELECT":
      var s = Selection.parse(
        state.selection.data,
        state.focusId,
        state.visibleIds
      );
      if (action.index === null) {
        s.clear();
      } else if (action.meta) {
        if (s.contains(action.index)) {
          s.deselect(action.index);
        } else {
          s.multiSelect(action.index);
        }
      } else if (action.shift) {
        s.extend(action.index);
      } else {
        s.select(action.index);
      }
      return {
        ...state,
        selection: {
          data: s.serialize(),
          ids: s.getSelectedItems(),
        },
      };

    case "SET_VISIBLE_IDS":
      // The visible ids changed
      var ids = state.selection.ids;
      // Start with a blank selection
      var s2 = new Selection([], null, "none", null, state.visibleIds);
      // Add each of the old selected ids to this new selection
      for (let id of ids) {
        if (id in action.idMap) s2.multiSelect(action.idMap[id]);
      }
      return {
        ...state,
        visibleIds: action.ids,
        selection: {
          ids,
          data: s2.serialize(),
        },
      };
    case "FOCUS":
      return {
        ...state,
        focusId: action.id,
      };
    default:
      return state;
  }
}

function equal(a: Cursor | null, b: Cursor | null) {
  if (a === null || b === null) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}
