import { BoolFunc } from "./utils";
import * as handlers from "./handlers";
import * as renderers from "./renderers";
import { ElementType, MouseEventHandler } from "react";
import { ListOnScrollProps } from "react-window";
import { NodeApi } from "../interfaces/node-api";
import { useDragDropManager } from "react-dnd";
import { NodeStruct } from "../nodes/node-struct";
import { OpenMap } from "../state/open-slice";

type PartialController<Value, Event> = {
  value: Value;
  onChange: (event: Event) => void;
};

// These all need to be worked out and compatibility must be kept
export type CreatePayload<T> = {
  parentId: string | null;
  index: number;
  data: T;
};

export type UpdatePayload<T> = {
  id: string;
  changes: Partial<T>;
};

export type MovePayload<T> = {
  dragIds: string[];
  parentId: string | null;
  index: number;
};

export type DestroyPayload<T> = {
  ids: string[];
  nodes: NodeApi<T>[];
};

export type NodesOnChangeEvent<T> =
  | { type: "create"; payload: CreatePayload<T> }
  | { type: "update"; payload: UpdatePayload<T> }
  | { type: "move"; payload: MovePayload<T> }
  | { type: "destroy"; payload: DestroyPayload<T> };

export interface TreeProps<T> {
  /* START V4 PROPS */
  nodes?: PartialController<NodeStruct<T>[], NodesOnChangeEvent<T>>;
  renderNode?: ElementType<renderers.NodeRendererProps<T>>;
  /* END V4 PROPS */

  /* Data Options */
  data?: readonly T[]; // deprecated will add back for compat
  initialData?: readonly T[]; //deprecated will add back for compat

  /* Data Handlers */
  onCreate?: handlers.CreateHandler<T>;
  onMove?: handlers.MoveHandler<T>;
  onRename?: handlers.RenameHandler<T>;
  onDelete?: handlers.DeleteHandler<T>;

  /* Renderers*/
  children?: ElementType<renderers.NodeRendererProps<T>>;
  renderRow?: ElementType<renderers.RowRendererProps<T>>;
  renderDragPreview?: ElementType<renderers.DragPreviewProps>;
  renderCursor?: ElementType<renderers.CursorProps>;
  renderContainer?: ElementType<{}>;

  /* Sizes */
  rowHeight?: number;
  overscanCount?: number;
  width?: number | string;
  height?: number;
  indent?: number;
  paddingTop?: number;
  paddingBottom?: number;
  padding?: number;

  /* Config */
  childrenAccessor?: string | ((d: T) => readonly T[] | null);
  idAccessor?: string | ((d: T) => string);
  openByDefault?: boolean;
  selectionFollowsFocus?: boolean;
  disableMultiSelection?: boolean;
  disableEdit?: string | boolean | BoolFunc<T>;
  disableDrag?: string | boolean | BoolFunc<T>;
  disableDrop?:
    | string
    | boolean
    | ((args: {
        parentNode: NodeApi<T>;
        dragNodes: NodeApi<T>[];
        index: number;
      }) => boolean);

  /* Event Handlers */
  onActivate?: (node: NodeApi<T>) => void;
  onSelect?: (nodes: NodeApi<T>[]) => void;
  onScroll?: (props: ListOnScrollProps) => void;
  onToggle?: (id: string) => void;
  onFocus?: (node: NodeApi<T>) => void;

  /* Selection */
  selection?: string;

  /* Open State */
  initialOpenState?: OpenMap;

  /* Search */
  searchTerm?: string;
  searchMatch?: (node: NodeApi<T>, searchTerm: string) => boolean;

  /* Extra */
  className?: string | undefined;
  rowClassName?: string | undefined;

  dndRootElement?: globalThis.Node | null;
  onClick?: MouseEventHandler;
  onContextMenu?: MouseEventHandler;
  dndManager?: ReturnType<typeof useDragDropManager>;
}
