import React, { FC } from "react";
import { IdObj, RowRendererProps } from "../types";
import { Tree } from "./tree";

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
        e.stopPropagation();
        node.focus();
      }}
      onClick={(e) => {
        node.select({ multi: e.metaKey, contiguous: e.shiftKey });
        node.activate();
      }}
    >
      {children}
    </div>
  );
}
