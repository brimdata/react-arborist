import { RootState } from "./root-reducer";

export const initialState = (): RootState => ({
  nodes: {
    // Changes together
    open: {},
    focus: { id: null, treeFocused: false },
    edit: { id: null },
    drag: { id: null },
    selection: { ids: new Set(), anchor: null, mostRecent: null },
  },
  dnd: { cursor: { type: "none" }, dragId: null },
});
