import { BoolFunc, IdObj } from "./utils";
import * as handlers from "./handlers";
import * as renderers from "./renderers";
import { ElementType, MouseEventHandler } from "react";
import { ListOnScrollProps } from "react-window";
import { NodeApi } from "../interfaces/node-api";
import { OpenMap, OpenSlice } from "../state/open-slice";

export interface TreeProps<T extends IdObj> {
  /* Data Options */
  data?: T[];
  initialData?: T[];

  /* Data Handlers */
  onCreate?: handlers.CreateHandler;
  onMove?: handlers.MoveHandler;
  onRename?: handlers.RenameHandler;
  onDelete?: handlers.DeleteHandler;

  /* Renderers*/
  children?: ElementType<renderers.NodeRendererProps<T>>;
  renderRow?: ElementType<renderers.RowRendererProps<T>>;
  renderDragPreview?: ElementType<renderers.DragPreviewProps>;
  renderCursor?: ElementType<renderers.CursorProps>;
  renderContainer?: ElementType<{}>;

  /* Sizes */
  rowHeight?: number;
  width?: number;
  height?: number;
  indent?: number;
  paddingTop?: number;
  paddingBottom?: number;
  padding?: number;

  /* Config */
  openByDefault?: boolean;
  selectionFollowsFocus?: boolean;
  disableDrag?: string | boolean | BoolFunc<T>;
  disableDrop?: string | boolean | BoolFunc<T>;
  childrenAccessor?: string | ((d: T) => T[]);
  idAccessor?: string | ((d: T) => string);

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
}
