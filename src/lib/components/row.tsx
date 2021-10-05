import React, {
  CSSProperties,
  memo,
  MouseEvent,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  useCursorParentId,
  useEditingId,
  useIsSelected,
  useStaticContext,
} from "../context";
import { useDragHook } from "../dnd/drag-hook";
import { useDropHook } from "../dnd/drop-hook";
import { edit, select } from "../reducer";

type Props = {
  style: CSSProperties;
  index: number;
};

export const Row = memo(function Row({ index, style }: Props) {
  const treeView = useStaticContext();
  const selected = useIsSelected();
  const node = treeView.visibleNodes[index];
  const next = treeView.visibleNodes[index + 1] || null;
  const prev = treeView.visibleNodes[index - 1] || null;
  const cursorParentId = useCursorParentId();
  const el = useRef<HTMLDivElement | null>(null);
  const [{ isDragging }, dragRef] = useDragHook(node);
  const dropRef = useDropHook(el, node, prev, next);
  const isEditing = node.id === useEditingId();
  const isSelected = selected(index);
  const nextSelected = next && selected(index + 1);
  const prevSelected = prev && selected(index - 1);
  const isHoveringOverChild = node.id === cursorParentId;
  const isOpen = node.isOpen;
  const indent = treeView.indent * node.level;
  const state = useMemo(() => {
    return {
      isEditing,
      isDragging,
      isFirstOfSelected: isSelected && !prevSelected,
      isLastOfSelected: isSelected && !nextSelected,
      isSelected,
      isHoveringOverChild,
      isOpen,
    };
  }, [
    isEditing,
    isSelected,
    prevSelected,
    nextSelected,
    isHoveringOverChild,
    isOpen,
    isDragging,
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
      row: { ...style, transition: "all 100ms" },
      indent: { paddingLeft: indent },
    }),
    [indent, style]
  );

  const handlers = useMemo(() => {
    return {
      select: (e: MouseEvent) => {
        if (node.rowIndex === null) return;
        treeView.dispatch(select(node.rowIndex, e.metaKey, e.shiftKey));
      },
      toggle: (e: MouseEvent) => {
        e.stopPropagation();
        treeView.onToggle(node.id, !node.isOpen);
      },
      edit: () => {
        treeView.dispatch(edit(node.id));
      },
      submit: (name: string) => {
        if (name.trim()) treeView.onEdit(node.id, name);
        treeView.dispatch(edit(null));
      },
      reset: () => {
        treeView.dispatch(edit(null));
      },
    };
  }, [treeView, node]);

  const Renderer = useMemo(() => {
    return memo(treeView.renderer);
  }, [treeView.renderer]);

  return (
    <Renderer
      innerRef={ref}
      data={node.model}
      styles={styles}
      state={state}
      handlers={handlers}
      preview={false}
      tree={treeView.monitor}
    />
  );
});
