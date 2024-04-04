import { CSSProperties, HTMLAttributes, ReactElement } from "react";
import { TreeController } from "../controllers/tree-controller";
import { NodeController } from "../controllers/node-controller";
import { XY } from "../dnd/types";

export type NodeRendererProps<T> = {
  style: CSSProperties;
  node: NodeController<T>;
  tree: TreeController<T>;
  dragHandle?: (el: HTMLDivElement | null) => void;
  preview?: boolean;
};

export type RowRendererProps<T> = {
  node: NodeController<T>;
  innerRef: (el: HTMLDivElement | null) => void;
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

export type CursorProps = {
  top: number;
  left: number;
  indent: number;
};
