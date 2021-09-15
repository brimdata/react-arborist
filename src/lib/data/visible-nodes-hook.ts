import { useMemo } from "react";
import { TreeProps, Node, IdObj } from "../types";
import { enrichTree } from "./enrich-tree";
import { flattenTree } from "./flatten-tree";

export function useVisibleNodes<T extends IdObj>(props: TreeProps<T>) {
  const root = useMemo<Node<T>>(
    () =>
      enrichTree<T>(
        props.data,
        props.hideRoot,
        props.getChildren,
        props.getIsOpen
      ),
    [props.data, props.hideRoot, props.getChildren, props.getIsOpen]
  );
  return useMemo(() => flattenTree(root), [root]);
}
