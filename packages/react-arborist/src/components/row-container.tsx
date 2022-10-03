import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useNodesContext, useTreeApi } from "../context";
import { useDragHook } from "../dnd/drag-hook";
import { useDropHook } from "../dnd/drop-hook";
import { IdObj } from "../types/utils";
import { useFreshNode } from "../hooks/use-fresh-node";

type Props = {
  style: React.CSSProperties;
  index: number;
};

export const RowContainer = React.memo(function RowContainer<T extends IdObj>({
  index,
  style,
}: Props) {
  /* When will the <Row> will re-render.
   *
   * The row component is memo'd so it will only render
   * when a new instance of the NodeApi class is passed
   * to it.
   *
   * The TreeApi instance is mostly-stable. It does not
   * change when the internal state changes, only when
   * the props change.
   *
   * The TreeApi has all the references to the nodes.
   * We need to clone the nodes when their state
   * changes. The node class contains no state itself,
   * It always checks the tree for state. The tree's
   * state will always be up to date.
   */

  const _ = useNodesContext(); // So that we re-render appropriately
  const tree = useTreeApi<T>(); // Tree already has the fresh state
  const node = useFreshNode<T>(index);

  const el = useRef<HTMLDivElement | null>(null);
  const dragRef = useDragHook<T>(node);
  const dropRef = useDropHook(el, node);
  const innerRef = useCallback(
    (n) => {
      el.current = n;
      dropRef(n);
    },
    [dropRef]
  );

  const indent = tree.indent * node.level;
  const nodeStyle = useMemo(() => ({ paddingLeft: indent }), [indent]);

  const rowAttrs: React.HTMLAttributes<any> = {
    role: "treeitem",
    "aria-level": node.level,
    style,
    tabIndex: 0,
  };

  useEffect(() => {
    if (!node.isEditing && node.isFocused) {
      el.current?.focus();
    }
  }, [node.isEditing, node.isFocused, el.current]);

  const Node = tree.renderNode;
  const Row = tree.renderRow;

  return (
    <Row node={node} innerRef={innerRef} attrs={rowAttrs}>
      <Node node={node} tree={tree} style={nodeStyle} dragHandle={dragRef} />
    </Row>
  );
});
