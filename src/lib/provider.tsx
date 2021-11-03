import { useImperativeHandle, useMemo, useReducer, useRef } from "react";
import { FixedSizeList } from "react-window";
import {
  CursorLocationContext,
  CursorParentId,
  EditingIdContext,
  IsCursorOverFolder,
  SelectionContext,
  Static,
} from "./context";
import { Cursor } from "./dnd/compute-drop";
import { initState, reducer } from "./reducer";
import { useSelectionKeys } from "./selection/selection-hook";
import { useTreeApi } from "./tree-api-hook";
import { StateContext, StaticContext, TreeProviderProps } from "./types";

export function TreeViewProvider<T>(props: TreeProviderProps<T>) {
  const [state, dispatch] = useReducer(reducer, initState());
  const list = useRef<FixedSizeList>();
  const api = useTreeApi<T>(state, dispatch, props, list.current);

  useImperativeHandle(props.imperativeHandle, () => api);
  useSelectionKeys(props.listEl, api);
  const staticValue = useMemo<StaticContext<T>>(
    () => ({ ...props, api, list }),
    [props, api, list]
  );

  /**
   * This context pattern is ridiculous, next time use redux.
   */
  return (
    // @ts-ignore
    <Static.Provider value={staticValue}>
      <EditingIdContext.Provider value={state.editingId}>
        <SelectionContext.Provider value={state.selection}>
          <CursorParentId.Provider value={getParentId(state.cursor)}>
            <IsCursorOverFolder.Provider value={isOverFolder(state)}>
              <CursorLocationContext.Provider value={state.cursor}>
                {props.children}
              </CursorLocationContext.Provider>
            </IsCursorOverFolder.Provider>
          </CursorParentId.Provider>
        </SelectionContext.Provider>
      </EditingIdContext.Provider>
    </Static.Provider>
  );
}

function getParentId(cursor: Cursor) {
  switch (cursor.type) {
    case "highlight":
      return cursor.id;
    default:
      return null;
  }
}

function isOverFolder(state: StateContext) {
  return state.cursor.type === "highlight";
}
