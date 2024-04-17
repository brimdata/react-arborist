import {
  CSSProperties,
  HTMLAttributes,
  MutableRefObject,
  ReactElement,
} from "react";
import { TreeController } from "../controllers/tree-controller.js";
import { NodeController } from "../controllers/node-controller.js";
import { XY } from "../dnd/types.js";

export type NodeRendererProps<T> = {
  attrs: HTMLAttributes<any>;
  style: CSSProperties;
  node: NodeController<T>;
  tree: TreeController<T>;
  dragHandle?: (el: HTMLDivElement | null) => void;
  preview?: boolean;
};

export type RowRendererProps<T> = {
  node: NodeController<T>;
  innerRef: MutableRefObject<any>;
  attrs: HTMLAttributes<any>;
  children: ReactElement;
};

export type DragPreviewProps = {
  offset: XY | null;
  mouse: XY | null;
  id: string | null;
  dragIds: string[];
  isDragging: boolean;
};

export type CursorRendererProps = {
  top: number;
  left: number;
  indent: number;
};
