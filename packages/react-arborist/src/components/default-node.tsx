import React from "react";
import { NodeRendererProps } from "../types/renderers";
import { IdObj } from "../types/utils";

export function DefaultNode<T extends IdObj>({
  style,
  node,
  dragHandle,
}: NodeRendererProps<T>) {
  return (
    <div style={style} ref={dragHandle}>
      ID: {node.data.id}
    </div>
  );
}
