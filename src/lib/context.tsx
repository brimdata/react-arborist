import {
  createContext,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
} from "react";
import { DropCursor } from "./components/drop-cursor";
import {
  edit,
  initState,
  reducer,
  select,
  selectId,
  setVisibleIds,
} from "./reducer";
import { Selection } from "./selection/selection";
import { useSelectionKeys } from "./selection/selection-hook";
import {
  Node,
  SelectionState,
  StaticContext,
  TreeViewProviderProps,
} from "./types";

const CursorParentId = createContext<string | null>(null);
export function useCursorParentId() {
  return useContext(CursorParentId);
}

const Static = createContext<StaticContext | null>(null);
export function useStaticContext() {
  const value = useContext(Static);
  if (!value) throw new Error("Context must be in a provider");
  return value;
}

const DispatchContext = createContext(null);
export function useDispatch() {
  const dispatch = useContext(DispatchContext);
  if (!dispatch) throw new Error("No dispatch provided");
  return dispatch;
}

const SelectionContext = createContext<SelectionState | null>(null);
export function useSelectedIds(): string[] {
  const value = useContext(SelectionContext);
  if (!value) throw new Error("Must provide selection context");
  return value.ids;
}

export function useIsSelected(): (index: number | null) => boolean {
  const value = useContext(SelectionContext);
  if (!value) throw new Error("Must provide selection context");
  const s = useMemo(() => Selection.parse(value.data, []), [value.data]);
  return (i) => s.contains(i);
}

const EditingIdContext = createContext<string | null>(null);
export function useEditingId(): string | null {
  return useContext(EditingIdContext);
}

export function TreeViewProvider(props: TreeViewProviderProps) {
  const [state, dispatch] = useReducer(reducer, initState());

  const visibleIds = useMemo(
    () => props.visibleNodes.map((n) => n.id),
    [props.visibleNodes]
  );

  useSelectionKeys(props.listRef, dispatch, visibleIds);

  const idToIndex = useMemo(() => {
    return props.visibleNodes.reduce<{ [id: string]: number }>(
      (map, node, index) => {
        map[node.id] = index;
        return map;
      },
      {}
    );
  }, [props.visibleNodes]);

  const staticValue = useMemo<StaticContext>(
    () => ({
      ...props,
      dispatch,
      getNode: (id: string): Node | null => {
        if (id in idToIndex) return props.visibleNodes[idToIndex[id]] || null;
        else return null;
      },
    }),
    [props, idToIndex]
  );

  useLayoutEffect(() => {
    dispatch(setVisibleIds(visibleIds, idToIndex));
  }, [idToIndex, visibleIds]);

  useImperativeHandle(
    props.handle,
    () => ({
      selectedIds: state.selection.ids,
      selectId: (id: string) => {
        const node = staticValue.getNode(id);
        if (node && node.rowIndex) {
          dispatch(select(node.rowIndex, false, false));
        } else {
          dispatch(selectId(id));
        }
      },
      edit: (id: string) => {
        dispatch(edit(id));
      },
    }),
    [staticValue, state.selection.ids]
  );
  return (
    // @ts-ignore
    <Static.Provider value={staticValue}>
      <EditingIdContext.Provider value={state.editingId}>
        <SelectionContext.Provider value={state.selection}>
          <CursorParentId.Provider
            value={state.cursorLocation?.parentId || null}
          >
            {props.children}
          </CursorParentId.Provider>
          <DropCursor
            root={props.listRef.current}
            cursor={state.cursorLocation}
          />
        </SelectionContext.Provider>
      </EditingIdContext.Provider>
    </Static.Provider>
  );
}
