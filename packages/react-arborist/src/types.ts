import React, {
  ComponentType,
  CSSProperties,
  HTMLAttributes,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  Ref,
} from "react";
import { AnyAction } from "redux";
import { Cursor } from "./dnd/compute-drop";
import { NodeInterface } from "./node-interface";
import { SelectionData } from "./selection/selection";
import { TreeApi } from "./tree-api";

// Forward ref can't forward generics without this little re-declare
// https://fettblog.eu/typescript-react-generic-forward-refs/
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type NodesById<T extends IdObj> = { [id: string]: NodeInterface<T> };

export interface IdObj {
  id: string;
}

export type NodeRendererProps<T extends IdObj> = {
  style: CSSProperties;
  node: NodeInterface<T>;
  tree: TreeApi<T>;
  preview?: boolean;
};

export type NodeState = {
  isOpen: boolean;
  isSelected: boolean;
  isHoveringOverChild: boolean;
  isDragging: boolean;
  isSelectedStart: boolean;
  isSelectedEnd: boolean;
  isEditing: boolean;
};

export type NodeHandlers = {
  toggle: MouseEventHandler;
  select: (e: MouseEvent, args: { selectOnClick: boolean }) => void;
  edit: () => Promise<EditResult>;
  submit: (name: string) => void;
  reset: () => void;
};

export type NodeRenderer<T extends IdObj> = ComponentType<NodeRendererProps<T>>;

export type MoveHandler = (
  dragIds: string[],
  parentId: string | null,
  index: number
) => void;

export type ToggleHandler = (id: string, isOpen: boolean) => void;
export type EditHandler = (id: string, name: string) => void;
export type NodeClickHandler<T extends IdObj> = (
  e: MouseEvent,
  n: NodeInterface<T>
) => void;
export type IndexClickHandler = (e: MouseEvent, index: number) => void;
export type SelectedCheck = (index: number) => boolean;

export type CursorLocation = {
  index: number | null;
  level: number | null;
  parentId: string | null;
};

export type DragItem = {
  dragIds: string[];
  id: string;
};

export type SelectionState = {
  data: SelectionData | null;
  ids: string[];
};

export type StateContext = {
  cursor: Cursor;
  editingId: string | null;
  selection: SelectionState;
  visibleIds: string[];
};

type BoolFunc<T> = (data: T) => boolean;

export type RowRendererProps<T extends IdObj> = {
  node: NodeInterface<T>;
  innerRef: (el: HTMLDivElement | null) => void;
  attrs: HTMLAttributes<any>;
  children: ReactElement;
};

export interface TreeProps<T extends IdObj> {
  data: T;

  /* Renderers*/
  children?: NodeRenderer<T>;
  rowRenderer?: ComponentType<RowRendererProps<T>>;
  previewRenderer?: NodeRenderer<T>;
  dropCursor?: (props: DropCursorProps) => ReactElement;

  /* Sizes */
  rowHeight?: number;
  width?: number;
  height?: number;
  indent?: number;

  /* Config */
  disableDrag?: string | boolean | BoolFunc<T>;
  disableDrop?: string | boolean | BoolFunc<T>;
  getChildren?: string | ((d: T) => T[]);
  isOpen?: string | BoolFunc<T>;
  hideRoot?: boolean;
  openByDefault?: boolean;
  match?: (data: T, term: string) => boolean;

  /* Data Handlers */
  onActivate?: (node: NodeInterface<T>) => void;
  onEdit?: EditHandler;
  onMove?: MoveHandler;
  onToggle?: ToggleHandler;

  /* Event Handlers */
  // On Scroll
  // On Select
  // On Focus

  /* Extra */
  handle?: Ref<TreeApi<T>>; // Deprecated
  className?: string | undefined;
  dndRootElement?: globalThis.Node | null;
  onClick?: MouseEventHandler;
  onContextMenu?: MouseEventHandler;
}

export type TreeProviderProps<T extends IdObj> = {
  treeProps: TreeProps<T>;
  imperativeHandle: React.Ref<TreeApi<T>> | undefined;
  children: ReactElement;
};

export type EditResult =
  | { cancelled: true }
  | { cancelled: false; value: string };

export type DropCursorProps = {
  top: number;
  left: number;
  indent: number;
};

export type SelectOptions = { multi?: boolean; contiguous?: boolean };

export type ActionTypes<
  Actions extends { [name: string]: (...args: any[]) => AnyAction }
> = ReturnType<Actions[keyof Actions]>;
