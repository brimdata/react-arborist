import {
  ReactNode,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { FixedSizeList } from "react-window";
import { TreeApiContext } from "../context";
import { TreeApi } from "../interfaces/tree-api";
import { IdObj } from "../types/utils";
import { initialState } from "../state/initial";
import { rootReducer } from "../state/root-reducer";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { TreeProps } from "../types/tree-props";

type Props<T extends IdObj> = {
  treeProps: TreeProps<T>;
  imperativeHandle: React.Ref<TreeApi<T>> | undefined;
  children: ReactNode;
};
export function TreeProvider<T extends IdObj>(props: Props<T>) {
  const [state, dispatch] = useReducer(rootReducer, initialState());
  const list = useRef<FixedSizeList | null>(null);
  const listEl = useRef<HTMLDivElement | null>(null);

  const api = useMemo(
    () => new TreeApi<T>(dispatch, state, props.treeProps, list, listEl),
    [dispatch, state, props.treeProps, list, listEl]
  );

  useImperativeHandle(props.imperativeHandle, () => api);

  return (
    <TreeApiContext.Provider value={api}>
      <DndProvider
        backend={HTML5Backend}
        options={{ rootElement: api.props.dndRootElement || undefined }}
      >
        {props.children}
      </DndProvider>
    </TreeApiContext.Provider>
  );
}
