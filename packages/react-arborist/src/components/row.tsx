import React, { useCallback, useMemo, useRef } from "react";
import {
  useCursorParentId,
  useEditingId,
  useIsCursorOverFolder,
  useIsSelected,
  useStaticContext,
} from "../context";
import { useDragHook } from "../dnd/drag-hook";
import { useDropHook } from "../dnd/drop-hook";

type Props = {
  style: React.CSSProperties;
  index: number;
};

export const Row = React.memo(function Row({ index, style }: Props) {
  const tree = useStaticContext();
  const selected = useIsSelected();
  const node = tree.api.visibleNodes[index];
  const next = tree.api.visibleNodes[index + 1] || null;
  const prev = tree.api.visibleNodes[index - 1] || null;
  const cursorParentId = useCursorParentId();
  const cursorOverFolder = useIsCursorOverFolder();
  const el = useRef<HTMLDivElement | null>(null);
  const [{ isDragging }, dragRef] = useDragHook(node);
  const [, dropRef] = useDropHook(el, node, prev, next);
  const isEditing = node.id === useEditingId();
  const isSelected = selected(index);
  const nextSelected = next && selected(index + 1);
  const prevSelected = prev && selected(index - 1);
  const isHoveringOverChild = node.id === cursorParentId;
  const isOverFolder = node.id === cursorParentId && cursorOverFolder;
  const isOpen = node.isOpen;
  const indent = tree.indent * node.level;
  const state = useMemo(() => {
    return {
      isEditing,
      isDragging,
      isSelectedStart: isSelected && !prevSelected,
      isSelectedEnd: isSelected && !nextSelected,
      isSelected,
      isHoveringOverChild,
      isOpen,
      isOverFolder,
    };
  }, [
    isEditing,
    isSelected,
    prevSelected,
    nextSelected,
    isHoveringOverChild,
    isOpen,
    isDragging,
    isOverFolder,
  ]);

  const ref = useCallback(
    (n: HTMLDivElement | null) => {
      el.current = n;
      dragRef(dropRef(n));
    },
    [dragRef, dropRef]
  );

  const styles = useMemo(
    () => ({
      row: { ...style },
      indent: { paddingLeft: indent },
    }),
    [indent, style]
  );

  const handlers = useMemo(() => {
    return {
      select: (
        e: React.MouseEvent,
        args: { selectOnClick: boolean } = { selectOnClick: true }
      ) => {
        if (node.rowIndex === null) return;
        if (args.selectOnClick || e.metaKey || e.shiftKey) {
          tree.api.select(node.rowIndex, e.metaKey, e.shiftKey);
        } else {
          tree.api.select(null, false, false);
        }
      },
      toggle: (e: React.MouseEvent) => {
        e.stopPropagation();
        tree.onToggle(node.id, !node.isOpen);
      },
      edit: () => tree.api.edit(node.id),
      submit: (name: string) => {
        name.trim() ? tree.api.submit(node.id, name) : tree.api.reset(node.id);
      },
      reset: () => tree.api.reset(node.id),
    };
  }, [tree, node]);

  const Renderer = useMemo(() => {
    return React.memo(tree.renderer);
  }, [tree.renderer]);

  return (
    <Renderer
      innerRef={ref}
      data={node.model}
      styles={styles}
      state={state}
      handlers={handlers}
      preview={false}
      tree={tree.api}
    />
  );
});
