import { RootState } from "./root-reducer";

export const initialState = (): RootState => ({
  open: {},
  focus: { id: null, treeFocused: false },
  edit: { id: null },
  dnd: { cursor: { type: "none" } },
  selection: { ids: new Set(), anchor: null, mostRecent: null },
});
