import {
  useEffect,
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
  Static,
} from "./context";
import { initState, reducer, setVisibleIds } from "./reducer";
import { useSelectionKeys } from "./selection/selection-hook";
import { TreeMonitor } from "./tree-monitor";
import { Node, StateContext, StaticContext, TreeProviderProps } from "./types";

export function TreeViewProvider<T>(props: TreeProviderProps<T>) {
  const [state, dispatch] = useReducer(reducer, initState());
  const list = useRef<FixedSizeList>();
  const monitor = useMemo(
    () => new TreeMonitor(state, dispatch, list),
    // eslint-disable-next-line
    []
  );
  useImperativeHandle(props.imperativeHandle, () => monitor);

  // useEffect(() => {
  // if (scrollId) {
  // list.current?.scrollToItem(index);
  // }
  // }, [scrollId]);

  useEffect(() => {
    monitor.assign(state, dispatch, list);
    // eslint-disable-next-line
  }, [state, dispatch, list]);

  const visibleIds = useMemo(
    () => props.visibleNodes.map((n) => n.id),
    [props.visibleNodes]
  );

  useSelectionKeys(props.listEl, dispatch, visibleIds);

  const idToIndex = useMemo(() => {
    return props.visibleNodes.reduce<{ [id: string]: number }>(
      (map, node, index) => {
        map[node.id] = index;
        return map;
      },
      {}
    );
  }, [props.visibleNodes]);

  const staticValue = useMemo<StaticContext<T>>(
    () => ({
      ...props,
      monitor,
      list,
      dispatch,
      getNode: (id: string): Node<T> | null => {
        if (id in idToIndex) return props.visibleNodes[idToIndex[id]] || null;
        else return null;
      },
    }),
    // eslint-disable-next-line
    [props, idToIndex]
  );

  useLayoutEffect(() => {
    dispatch(setVisibleIds(visibleIds, idToIndex));
  }, [idToIndex, visibleIds]);

  return (
    // @ts-ignore
    <Static.Provider value={staticValue}>
      <EditingIdContext.Provider value={state.editingId}>
        <SelectionContext.Provider value={state.selection}>
          <CursorParentId.Provider
            value={state.cursorLocation?.parentId || null}
          >
            <IsCursorOverFolder.Provider value={isOverFolder(state)}>
              <CursorLocationContext.Provider value={state.cursorLocation}>
                {props.children}
              </CursorLocationContext.Provider>
            </IsCursorOverFolder.Provider>
          </CursorParentId.Provider>
        </SelectionContext.Provider>
      </EditingIdContext.Provider>
    </Static.Provider>
  );
}

function isOverFolder(state: StateContext) {
  if (state.cursorLocation) {
    return (
      !!state.cursorLocation.parentId && state.cursorLocation.index === null
    );
  } else {
    return false;
  }
}
