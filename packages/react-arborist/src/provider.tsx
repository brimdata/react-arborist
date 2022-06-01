import {
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { FixedSizeList } from "react-window";
import { TreeApiContext } from "./context";
import { actions, initState, reducer } from "./reducer";
import { useSelectionKeys } from "./selection/selection-hook";
import { TreeApi } from "./tree-api";
import { IdObj, TreeProviderProps } from "./types";

export function TreeViewProvider<T extends IdObj>(props: TreeProviderProps<T>) {
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

  return (
    <TreeApiContext.Provider value={api}>
      {props.children}
    </TreeApiContext.Provider>
  );
}
