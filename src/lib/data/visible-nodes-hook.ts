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
        props.childrenAccessor,
        props.isOpenAccessor,
        props.openByDefault
      ),
    [
      props.data,
      props.hideRoot,
      props.childrenAccessor,
      props.isOpenAccessor,
      props.openByDefault,
    ]
  );
  const visibleNodes = useMemo(() => flattenTree(root), [root]);
  return [visibleNodes, root] as [Node<T>[], Node<T>];
}
