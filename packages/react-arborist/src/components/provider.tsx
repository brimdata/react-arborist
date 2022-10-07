import {
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";
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
import { actions as visibility } from "../state/open-slice";

type Props<T extends IdObj> = {
  treeProps: TreeProps<T>;
  imperativeHandle: React.Ref<TreeApi<T> | undefined>;
  children: ReactNode;
};

const SERVER_STATE = initialState();

export function TreeProvider<T extends IdObj>(props: Props<T>) {
  const list = useRef<FixedSizeList | null>(null);
  const listEl = useRef<HTMLDivElement | null>(null);
  const store = useRef<Store>(createStore(rootReducer));
  const state = useSyncExternalStore(
    store.current.subscribe,
    store.current.getState,
    () => SERVER_STATE
  );

  /* The tree api only changes it's identity when the props change. */
  const api = useMemo(() => {
    return new TreeApi<T>(store.current, props.treeProps, list, listEl);
  }, [props.treeProps, state.nodes.open]);
  useImperativeHandle(props.imperativeHandle, () => api);

  useEffect(() => {
    if (api.props.selection) {
      api.select(api.props.selection);
    } else {
      api.selectNone();
    }
  }, [api.props.selection]);

  useEffect(() => {
    if (!api.props.searchTerm) {
      store.current.dispatch(visibility.clear(true));
    }
  }, [api.props.searchTerm]);

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
