import React, {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useTreeApi } from "../context";
import { useDragHook } from "../dnd/drag-hook";
import { useDropHook } from "../dnd/drop-hook";
import { NodeRendererProps } from "../types/renderers";
import { IdObj } from "../types/utils";

type Props = {
  style: React.CSSProperties;
  index: number;
};

export const RowContainer = React.memo(function RowContainer<T extends IdObj>({
  index,
  style,
}: Props) {
  const tree = useTreeApi<T>();
  const node = tree.visibleNodes[index];
  const next = tree.visibleNodes[index + 1] || null;
  const prev = tree.visibleNodes[index - 1] || null;
  const el = useRef<HTMLDivElement | null>(null);
  const [{ isDragging }, dragRef] = useDragHook<T>(node);
  const [, dropRef] = useDropHook(el, node, prev, next);
  const isSelected = tree.isSelected(node.id);
  const nextSelected = next && tree.isSelected(tree.at(index + 1)?.id);
  const prevSelected = prev && tree.isSelected(tree.at(index - 1)?.id);
  const isHoveringOverChild = node.id === tree.cursorParentId;
  const isOverFolder = node.id === tree.cursorParentId && tree.cursorOverFolder;
  const isOpen = node.isOpen;
  const indent = tree.indent * node.level;
  const isFocused = tree.isFocused(node.id);

  const ref = useCallback(
    (n: HTMLDivElement | null) => {
      el.current = n;
      dragRef(dropRef(n));
    },
    [dragRef, dropRef]
  );

  const nodeStyle = useMemo(() => ({ paddingLeft: indent }), [indent]);

  const Node = useMemo<ComponentType<NodeRendererProps<T>>>(
    () => React.memo(tree.renderNode),
    [tree.renderNode]
  );

  const Row = useMemo(() => React.memo(tree.renderRow), [tree.renderRow]);

  const rowAttrs: React.HTMLAttributes<any> = {
    role: "treeitem",
    "aria-level": node.level,
    style,
    tabIndex: 0,
  };

  useEffect(() => {
    if (!node.isEditing && isFocused) {
      el.current?.focus();
    }
  }, [node.isEditing, isFocused, el.current]);

  return (
    <Row node={node} innerRef={ref} attrs={rowAttrs}>
      <Node node={node} tree={tree} style={nodeStyle} />
    </Row>
  );
});
