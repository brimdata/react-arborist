import {
  ComponentType,
  ForwardedRef,
  MouseEvent,
  MouseEventHandler,
  MutableRefObject,
  ReactElement,
} from "react";
import { Action } from "./reducer";
import { SelectionData } from "./selection/selection";

export type Node<M extends NodeModel = NodeModel> = {
  id: string;
  model: M;
  level: number;
  children: Node<M>[] | null;
  parent: Node<M> | null;
  isOpen: boolean;
  rowIndex: number | null;
};

export type NodesById = { [id: string]: Node };

export type NodeModel = {
  id: string;
  children?: NodeModel[];
  isOpen?: boolean;
};

export type NodeRendererProps<M extends NodeModel> = {
  preview: boolean;
  node: Node<M>;
  props: object;
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

export type NodeRenderer<M extends NodeModel = NodeModel> = ComponentType<
  NodeRendererProps<M>
>;

export type OnMove = (
  dragIds: string[],
  parentId: string | null,
  index: number
) => void;

export type IdHandler = (id: string) => void;
export type RenameHandler = (id: string, name: string) => void;
export type NodeClickHandler = (e: MouseEvent, n: Node) => void;
export type IndexClickHandler = (e: MouseEvent, index: number) => void;
export type SelectedCheck = (index: number) => boolean;

export type CursorLocation = {
  parentId: string | null;
  index: number | null;
  level: number | null;
};

export type DragItem = {
  id: string;
  dragIds: string[];
};

export type SelectionState = {
  ids: string[];
  data: SelectionData | null;
};

export type StateContext = {
  visibleIds: string[];
  editingId: string | null;
  cursorLocation: CursorLocation | null;
  selection: SelectionState;
};

export type TreeViewProps = {
  children: NodeRenderer<any>;
  data: NodeModel;
  width: number;
  height: number;
  indent?: number;
  rowHeight?: number;
  onMove?: OnMove;
  onOpen?: IdHandler;
  onClose?: IdHandler;
  onRename?: RenameHandler;
  className?: string | undefined;
  hideRoot?: boolean;
};

export type TreeViewProviderProps = {
  handle: ForwardedRef<TreeViewHandle>;
  renderer: NodeRenderer<any>;
  visibleNodes: Node[];
  listRef: MutableRefObject<HTMLDivElement | null>;
  children: ReactElement;
  indent: number;
  rowHeight: number;
  width: number;
  height: number;
  onMove: OnMove;
  onOpen: IdHandler;
  onClose: IdHandler;
  onRename: RenameHandler;
};

export type StaticContext = TreeViewProviderProps & {
  dispatch: (a: Action) => void;
  getNode: (id: string) => Node | null;
};

export type TreeViewHandle = {
  selectedIds: string[];
  selectId: (id: string) => void;
  edit: (id: string) => void;
};
