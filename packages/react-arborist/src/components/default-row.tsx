import React from "react";
import { RowRendererProps } from "../types/renderers";
import { IdObj } from "../types/utils";

export function DefaultRow<T extends IdObj>({
  node,
  attrs,
  innerRef,
  children,
}: RowRendererProps<T>) {
  return (
    <div
      {...attrs}
      ref={innerRef}
      onClick={(e) => {
        if (e.metaKey) {
          node.isSelected ? node.deselect() : node.selectMulti();
        } else if (e.shiftKey) {
          node.selectContiguous();
        } else {
          node.select();
        }
      }}
    >
      {children}
    </div>
  );
}
