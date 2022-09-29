import React, {
  ComponentType,
  CSSProperties,
  HTMLAttributes,
  MouseEvent,
  MouseEventHandler,
  ReactChildren,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { XYCoord } from "react-dnd";
import { AnyAction } from "redux";
import { Cursor } from "./dnd/compute-drop";
import { NodeApi } from "./interfaces/node-api";
import { TreeApi } from "./interfaces/tree-api";

// Forward ref can't forward generics without this little re-declare
// https://fettblog.eu/typescript-react-generic-forward-refs/
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type NodesById<T extends IdObj> = { [id: string]: NodeApi<T> };

export interface IdObj {
  id: string;
}

export type NodeRendererProps<T extends IdObj> = {
  style: CSSProperties;
  node: NodeApi<T>;
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
  n: NodeApi<T>
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

type BoolFunc<T> = (data: T) => boolean;

export type RowRendererProps<T extends IdObj> = {
  node: NodeApi<T>;
  innerRef: (el: HTMLDivElement | null) => void;
  attrs: HTMLAttributes<any>;
  children: ReactElement;
};

export type DragPreviewProps = {
  offset: XYCoord | null;
  mouse: XYCoord | null;
  id: string | null;
  dragIds: string[];
  isDragging: boolean;
};

export interface TreeProps<T extends IdObj> {
  data: T;

  /* Renderers*/
  children?: NodeRenderer<T>;
  renderRow?: ComponentType<RowRendererProps<T>>;
  renderDragPreview?: ComponentType<DragPreviewProps>;
  renderCursor?: (props: DropCursorProps) => ReactElement;
  renderContainer?: () => ReactElement;

  /* Sizes */
  rowHeight?: number;
  width?: number;
  height?: number;
  indent?: number;

  /* Config */
  disableDrag?: string | boolean | BoolFunc<T>;
  disableDrop?: string | boolean | BoolFunc<T>;
  getChildren?: string | ((d: T) => T[]);
  match?: (data: T, term: string) => boolean;
  isOpen?: string | BoolFunc<T>;
  hideRoot?: boolean;
  openByDefault?: boolean;
  selectionFollowsFocus?: boolean;

  /* Data Handlers */
  onActivate?: (node: NodeApi<T>) => void;
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
  children: ReactNode;
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
