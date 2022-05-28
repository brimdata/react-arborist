import {
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { FixedSizeList } from "react-window";
import {
  CursorLocationContext,
  CursorParentId,
  EditingIdContext,
  IsCursorOverFolder,
  SelectionContext,
  TreeApiContext,
} from "./context";
import { Cursor } from "./dnd/compute-drop";
import { actions, initState, reducer } from "./reducer";
import { useSelectionKeys } from "./selection/selection-hook";
import { TreeApi } from "./tree-api";
import { StateContext, StaticContext, TreeProviderProps } from "./types";

export function TreeViewProvider<T>(props: TreeProviderProps<T>) {
  const [state, dispatch] = useReducer(reducer, initState());
  const list = useRef<FixedSizeList | null>(null);
  const listEl = useRef<HTMLDivElement | null>(null);
  const api = useMemo(
    () => new TreeApi<T>(dispatch, state, props, list, listEl),
    [dispatch, state, props, list, listEl]
  );

  /**
   * This ensures that the selection remains correct even
   * after opening and closing a folders
   */
  useLayoutEffect(() => {
    dispatch(actions.setVisibleIds(api.visibleIds, api.idToIndex));
  }, [dispatch, api.visibleIds, api.idToIndex, props.root]);

  useImperativeHandle(props.imperativeHandle, () => api);
  useSelectionKeys(listEl, api);

  console.log(api.height);

  return (
    // @ts-ignore
    <TreeApiContext.Provider value={api}>
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
    </TreeApiContext.Provider>
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
