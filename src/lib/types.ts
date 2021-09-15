import {
  ComponentType,
  CSSProperties,
  MouseEvent,
  MouseEventHandler,
  MutableRefObject,
  ReactElement,
  Ref,
} from "react";
import { Action } from "./reducer";
import { SelectionData } from "./selection/selection";

export type Node<T = unknown> = {
  id: string;
  model: T;
  level: number;
  children: Node<T>[] | null;
  parent: Node<T> | null;
  isOpen: boolean;
  rowIndex: number | null;
};

export type NodesById<T> = { [id: string]: Node<T> };

export interface IdObj {
  id: string;
}

export type NodeRendererProps<T> = {
  preview: boolean;
  node: Node<T>;
  props: { style: CSSProperties; ref: Ref<any> };
  indent: number;
  state: NodeState;
  handlers: NodeHandlers;
};

export type NodeState = {
  isEditing: boolean;
  isSelected: boolean;
  isOpen: boolean;
  isHoveringOverChild: boolean;
};

export type NodeHandlers = {
  toggleIsOpen: MouseEventHandler;
  toggleIsSelected: MouseEventHandler;
  toggleIsEditing: () => void;
  rename: (name: string) => void;
};

export type NodeRenderer<T> = ComponentType<NodeRendererProps<T>>;

export type OnMove = (
  dragIds: string[],
  parentId: string | null,
  index: number
) => void;

export type IdHandler = (id: string) => void;
export type RenameHandler = (id: string, name: string) => void;
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
  cursorLocation: CursorLocation | null;
  editingId: string | null;
  selection: SelectionState;
  visibleIds: string[];
};

export interface TreeProps<T> {
  children: NodeRenderer<T>;
  data: T;
  height: number;
  width: number;

  className?: string | undefined;
  getChildren?: (model: T) => T[] | undefined;
  getIsOpen?: (model: T) => boolean;
  handle?: Ref<TreeHandle>;
  hideRoot?: boolean;
  indent?: number;
  onClose?: IdHandler;
  onMove?: OnMove;
  onOpen?: IdHandler;
  onRename?: RenameHandler;
  rowHeight?: number;
}

export type TreeProviderProps<T> = {
  children: ReactElement;
  handle?: Ref<TreeHandle>;
  height: number;
  indent: number;
  listRef: MutableRefObject<HTMLDivElement | null>;
  onClose: IdHandler;
  onMove: OnMove;
  onOpen: IdHandler;
  onRename: RenameHandler;
  renderer: NodeRenderer<any>;
  rowHeight: number;
  visibleNodes: Node<T>[];
  width: number;
};

export type StaticContext<T> = TreeProviderProps<T> & {
  dispatch: (a: Action) => void;
  getNode: (id: string) => Node<T> | null;
};

export type TreeHandle = {
  edit: (id: string) => void;
  selectedIds: string[];
  selectId: (id: string) => void;
};
