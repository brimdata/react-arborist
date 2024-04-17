import { BoolFunc } from "./utils.js";
import * as handlers from "./handlers.js";
import * as renderers from "./renderers.js";
import { ElementType, MouseEventHandler } from "react";
import { ListOnScrollProps } from "react-window";
import { NodeController } from "../controllers/node-controller.js";

export interface TreeProps<T> {
  /* Data Options */
  data?: readonly T[];
  initialData?: readonly T[];

  /* Data Handlers */
  onCreate?: handlers.CreateHandler<T>;
  onMove?: handlers.MoveHandler<T>;
  onRename?: handlers.RenameHandler<T>;
  onDelete?: handlers.DeleteHandler<T>;

  /* Renderers*/
  children?: ElementType<renderers.NodeRendererProps<T>>;
  renderRow?: ElementType<renderers.RowRendererProps<T>>;
  renderDragPreview?: ElementType<renderers.DragPreviewProps>;
  renderCursor?: ElementType<renderers.CursorRendererProps>;
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
        parentNode: NodeController<T>;
        dragNodes: NodeController<T>[];
        index: number;
      }) => boolean);

  /* Event Handlers */
  onActivate?: (node: NodeController<T>) => void;
  onSelect?: (nodes: NodeController<T>[]) => void;
  onScroll?: (props: ListOnScrollProps) => void;
  onToggle?: (id: string) => void;
  onFocus?: (node: NodeController<T>) => void;

  /* Selection */
  selection?: string;

  /* Open State */
  initialOpenState?: Record<string, boolean>;

  /* Search */
  searchTerm?: string;
  searchMatch?: (node: NodeController<T>, searchTerm: string) => boolean;

  /* Extra */
  className?: string | undefined;
  rowClassName?: string | undefined;

  onClick?: MouseEventHandler;
  onContextMenu?: MouseEventHandler;
}
