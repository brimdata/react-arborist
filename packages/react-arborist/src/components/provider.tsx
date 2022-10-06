import {
  ReactNode,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { FixedSizeList } from "react-window";
import { DndContext, NodesContext, TreeApiContext } from "../context";
import { TreeApi } from "../interfaces/tree-api";
import { IdObj } from "../types/utils";
import { initialState } from "../state/initial";
import { rootReducer } from "../state/root-reducer";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { TreeProps } from "../types/tree-props";
import { createStore, Store } from "redux";

type Props<T extends IdObj> = {
  treeProps: TreeProps<T>;
  imperativeHandle: React.Ref<TreeApi<T> | undefined>;
  children: ReactNode;
};
export function TreeProvider<T extends IdObj>(props: Props<T>) {
  const list = useRef<FixedSizeList | null>(null);
  const listEl = useRef<HTMLDivElement | null>(null);
  const store = useRef<Store>(createStore(rootReducer));
  const state = store.current.getState();

  /* The tree api only changes it's identity when the props change. */
  const api = useMemo(() => {
    return new TreeApi<T>(store.current, props.treeProps, list, listEl);
  }, [props.treeProps, state.nodes.open]);

  const [_, rerender] = useReducer((state) => state + 1, 0);
  useLayoutEffect(() => {
    return store.current.subscribe(rerender);
  }, []);

  useImperativeHandle(props.imperativeHandle, () => api);

  useEffect(() => {
    if (api.props.selection) {
      console.log(api.props.selection);
      api.select(api.props.selection);
    } else {
      api.selectNone();
    }
  }, [api.props.selection]);

  return (
    <TreeApiContext.Provider value={api}>
      <NodesContext.Provider value={state.nodes}>
        <DndContext.Provider value={state.dnd}>
          <DndProvider
            backend={HTML5Backend}
            options={{ rootElement: api.props.dndRootElement || undefined }}
          >
            {props.children}
          </DndProvider>
        </DndContext.Provider>
      </NodesContext.Provider>
    </TreeApiContext.Provider>
  );
}
