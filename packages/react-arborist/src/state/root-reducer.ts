import { ActionFromReducer, combineReducers } from "redux";
import { reducer as focus } from "./focus-slice";
import { reducer as edit } from "./edit-slice";
import { reducer as dnd } from "./dnd-slice";
import { reducer as selection } from "./selection-slice";
import { reducer as open } from "./open-slice";

export const rootReducer = combineReducers({
  focus,
  edit,
  dnd,
  selection,
  open,
});

export type RootState = ReturnType<typeof rootReducer>;
export type Actions = ActionFromReducer<typeof rootReducer>;
