import React, {
  ComponentType,
  CSSProperties,
  MouseEvent,
  MouseEventHandler,
  MutableRefObject,
  ReactElement,
  Ref,
} from "react";
import { FixedSizeList } from "react-window";
import { Cursor } from "./dnd/compute-drop";
import { SelectionData } from "./selection/selection";
import { TreeApi } from "./tree-api";

// Forward ref can't forward generics without this little re-declare
// https://fettblog.eu/typescript-react-generic-forward-refs/
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type Node<T = unknown> = {
  id: string;
  model: T;
  level: number;
  children: Node<T>[] | null;
  parent: Node<T> | null;
  isOpen: boolean;
  isDraggable: boolean;
  isDroppable: boolean;
  rowIndex: number | null;
};

export type NodesById<T> = { [id: string]: Node<T> };

export interface IdObj {
  id: string;
}

export type NodeRendererProps<T extends IdObj> = {
  innerRef: (el: HTMLDivElement | null) => void;
  styles: { row: CSSProperties; indent: CSSProperties };
  data: T;
  state: NodeState;
  handlers: NodeHandlers;
  tree: TreeApi<T>;
  preview: boolean;
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
export type NodeClickHandler<T> = (e: MouseEvent, n: Node<T>) => void;
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

export interface TreeProps<T extends IdObj> {
  children: NodeRenderer<T>;
  className?: string | undefined;
  data: T;
  disableDrag?: string | boolean | BoolFunc<T>;
  disableDrop?: string | boolean | BoolFunc<T>;
  dndRootElement?: globalThis.Node | null;
  getChildren?: string | ((d: T) => T[]);
  handle?: Ref<TreeApi<T>>; // Deprecated
  height?: number;
  hideRoot?: boolean;
  indent?: number;
  isOpen?: string | BoolFunc<T>;
  onClick?: MouseEventHandler;
  onContextMenu?: MouseEventHandler;
  onEdit?: EditHandler;
  onMove?: MoveHandler;
  onToggle?: ToggleHandler;
  openByDefault?: boolean;
  rowHeight?: number;
  width?: number;
}

export type TreeProviderProps<T extends IdObj> = {
  treeProps: TreeProps<T>;
  imperativeHandle: React.Ref<TreeApi<T>> | undefined;
  children: ReactElement;
  root: Node<T>;
};

export type EditResult =
  | { cancelled: true }
  | { cancelled: false; value: string };
