import { BoolFunc, IdObj } from "./utils";
import * as handlers from "./handlers";
import * as renderers from "./renderers";
import { ComponentType, ElementType, MouseEventHandler } from "react";
import { ListOnScrollProps } from "react-window";

export interface TreeProps<T extends IdObj> {
  /* Data Options */
  data?: T | T[];
  defaultData?: T | T[];

  /* Data Handlers */
  onCreate?: handlers.CreateHandler;
  onMove?: handlers.MoveHandler;
  onRename?: handlers.RenameHandler;
  onDelete?: handlers.DeleteHandler;

  /* Renderers*/
  children?: ElementType<renderers.NodeRendererProps<T>>;
  renderRow?: ElementType<renderers.RowRendererProps<T>>;
  renderDragPreview?: ElementType<renderers.DragPreviewProps>;
  renderCursor?: ElementType<renderers.DropCursorProps>;
  renderContainer?: ElementType<{}>;

  /* Sizes */
  rowHeight?: number;
  width?: number;
  height?: number;
  indent?: number;

  /* Config */
  openByDefault?: boolean;
  selectionFollowsFocus?: boolean;
  disableDrag?: string | boolean | BoolFunc<T>;
  disableDrop?: string | boolean | BoolFunc<T>;
  getChildren?: string | ((d: T) => T[]);
  match?: (data: T, term: string) => boolean;
  isOpen?: string | BoolFunc<T>;

  /* Event Handlers */
  onScroll?: (props: ListOnScrollProps) => void;
  onActivate?: (data: T) => void;
  onPreview?: (data: T) => void;
  onSelect?: (data: T[]) => void;
  // On Focus

  /* Selection */
  selection?: string;

  /* Search */
  searchTerm?: string;
  searchMatch?: (data: T, searchTerm: string) => boolean;

  /* Extra */
  className?: string | undefined;
  dndRootElement?: globalThis.Node | null;
  onClick?: MouseEventHandler;
  onContextMenu?: MouseEventHandler;
}
