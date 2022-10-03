import { CSSProperties, HTMLAttributes, ReactElement } from "react";
import { IdObj } from "./utils";
import { NodeApi } from "../interfaces/node-api";
import { TreeApi } from "../interfaces/tree-api";
import { XYCoord } from "react-dnd";

export type NodeRendererProps<T extends IdObj> = {
  style: CSSProperties;
  node: NodeApi<T>;
  tree: TreeApi<T>;
  dragHandle?: (el: HTMLDivElement | null) => void;
  preview?: boolean;
};

export type RowRendererProps<T extends IdObj> = {
  node: NodeApi<T>;
  innerRef: (el: HTMLDivElement | null) => void;
  attrs: HTMLAttributes<any>;
  children: ReactElement;
};

export type DragPreviewProps = {
  offset: XYCoord | null;
  mouse: XYCoord | null;
  id: string | null;
  dragIds: string[];
  isDragging: boolean;
};

export type DropCursorProps = {
  top: number;
  left: number;
  indent: number;
};
