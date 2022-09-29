import React, { FC } from "react";
import { IdObj, NodeRendererProps, RowRendererProps } from "../types";

export function DefaultNode<T extends IdObj>({
  style,
  node,
}: NodeRendererProps<T>) {
  return <div style={style}>ID: {node.data.id}</div>;
}
