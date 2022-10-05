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
      onFocus={(e) => {
        e.stopPropagation(); // To prevent the tree from receiving focus
        node.focus();
      }}
      onClick={(e) => {
        node.select({ multi: e.metaKey, contiguous: e.shiftKey });
      }}
    >
      {children}
    </div>
  );
}
