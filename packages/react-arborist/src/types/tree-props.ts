import { BoolFunc } from "./utils";
import * as handlers from "./handlers";
import * as renderers from "./renderers";
import { ElementType, MouseEventHandler } from "react";
import { ListOnScrollProps } from "react-window";
import { NodeApi } from "../interfaces/node-api";
import { OpenMap, OpenSlice } from "../state/open-slice";
import { Keybinding } from "../interfaces/keybindings";

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
  renderCursor?: ElementType<renderers.CursorProps>;
  renderContainer?: ElementType<{}>;

  /* Sizes */
  rowHeight?: number;
  width?: number | string;
  height?: number;
  indent?: number;
  paddingTop?: number;
  paddingBottom?: number;
  padding?: number;

  /* Config */
  openByDefault?: boolean;
  selectionFollowsFocus?: boolean;
  disableMultiSelection?: boolean;
  disableDrag?: string | boolean | BoolFunc<T>;
  disableDrop?: string | boolean | BoolFunc<T>;
  childrenAccessor?: string | ((d: T) => T[] | null);
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

  /* Keybindings */
  keybindings?: Keybinding;

  dndRootElement?: globalThis.Node | null;
  onClick?: MouseEventHandler;
  onContextMenu?: MouseEventHandler;
}
