import { BoolFunc, IdObj } from "./utils";
import * as handlers from "./handlers";
import * as renderers from "./renderers";
import { ComponentType, MouseEventHandler, Ref } from "react";
import { TreeApi } from "../interfaces/tree-api";

export interface TreeProps<T extends IdObj> {
  /* Data Options */
  data: T | T[];
  defaultData: T | T[];

  /* Data Handlers */
  onCreate?: handlers.CreateHandler;
  onMove?: handlers.MoveHandler;
  onRename?: handlers.RenameHandler;
  onDelete?: handlers.DeleteHandler;

  /* Renderers*/
  children?: ComponentType<renderers.NodeRendererProps<T>>;
  renderRow?: ComponentType<renderers.RowRendererProps<T>>;
  renderDragPreview?: ComponentType<renderers.DragPreviewProps>;
  renderCursor?: ComponentType<renderers.DropCursorProps>;
  renderContainer?: ComponentType<{}>;

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
  // On Scroll
  // On Select
  // On Focus
  // onActivate?: (node: NodeApi<T>) => void;

  /* Extra */
  handle?: Ref<TreeApi<T>>; // Deprecated
  className?: string | undefined;
  dndRootElement?: globalThis.Node | null;
  onClick?: MouseEventHandler;
  onContextMenu?: MouseEventHandler;
}
