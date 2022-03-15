import { Selection } from "./selection/selection";
export const initState = () => ({
    visibleIds: [],
    cursor: { type: "none" },
    editingId: null,
    selection: {
        data: null,
        ids: [],
    },
});
export const actions = {
    setCursorLocation: (cursor) => ({
        type: "SET_CURSOR_LOCATION",
        cursor,
    }),
    setVisibleIds: (ids, // index to id
    idMap // id to index
    ) => ({
        type: "SET_VISIBLE_IDS",
        ids,
        idMap,
    }),
    select: (index, meta, shift) => ({
        type: "SELECT",
        index,
        meta,
        shift,
    }),
    selectId: (id) => ({
        type: "SELECT_ID",
        id,
    }),
    edit: (id) => ({
        type: "EDIT",
        id,
    }),
    stepUp: (shift, ids) => ({
        type: "STEP_UP",
        shift,
    }),
    stepDown: (shift, ids) => ({
        type: "STEP_DOWN",
        shift,
    }),
};
export function reducer(state, action) {
    switch (action.type) {
        case "EDIT":
            return {
                ...state,
                editingId: action.id,
            };
        case "SET_CURSOR_LOCATION":
            if (equal(state.cursor, action.cursor)) {
                return state;
            }
            else {
                return { ...state, cursor: action.cursor };
            }
        case "SELECT":
            var s = Selection.parse(state.selection.data, state.visibleIds);
            if (action.index === null) {
                s.clear();
            }
            else if (action.meta) {
                if (s.contains(action.index)) {
                    s.deselect(action.index);
                }
                else {
                    s.multiSelect(action.index);
                }
            }
            else if (action.shift) {
                s.extend(action.index);
            }
            else {
                s.select(action.index);
            }
            return {
                ...state,
                selection: {
                    data: s.serialize(),
                    ids: s.getSelectedItems(),
                },
            };
        case "SELECT_ID":
            return {
                ...state,
                selection: {
                    ...state.selection,
                    ids: [action.id],
                },
            };
        case "STEP_UP":
            var s3 = Selection.parse(state.selection.data, state.visibleIds);
            var f = s3.getFocus();
            if (action.shift) {
                s3.extend(f - 1);
            }
            else {
                s3.select(f - 1);
            }
            return {
                ...state,
                selection: {
                    data: s3.serialize(),
                    ids: s3.getSelectedItems(),
                },
            };
        case "STEP_DOWN":
            var s6 = Selection.parse(state.selection.data, state.visibleIds);
            var f2 = s6.getFocus();
            if (action.shift) {
                s6.extend(f2 + 1);
            }
            else {
                s6.select(f2 + 1);
            }
            return {
                ...state,
                selection: {
                    data: s6.serialize(),
                    ids: s6.getSelectedItems(),
                },
            };
        case "SET_VISIBLE_IDS":
            // The visible ids changed
            var ids = state.selection.ids;
            // Start with a blank selection
            var s2 = new Selection([], null, "none", state.visibleIds);
            // Add each of the old selected ids to this new selection
            for (let id of ids) {
                if (id in action.idMap)
                    s2.multiSelect(action.idMap[id]);
            }
            return {
                ...state,
                visibleIds: action.ids,
                selection: {
                    ids,
                    data: s2.serialize(),
                },
            };
        default:
            return state;
    }
}
function equal(a, b) {
    if (a === null || b === null)
        return false;
    return JSON.stringify(a) === JSON.stringify(b);
}
