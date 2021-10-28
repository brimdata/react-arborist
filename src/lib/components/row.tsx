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
  useIsCursorOverFolder,
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
  const tree = useStaticContext();
  const selected = useIsSelected();
  const node = tree.visibleNodes[index];
  const next = tree.visibleNodes[index + 1] || null;
  const prev = tree.visibleNodes[index - 1] || null;
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
      isFirstOfSelected: isSelected && !prevSelected,
      isLastOfSelected: isSelected && !nextSelected,
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
      select: (e: MouseEvent, selectOnClick: boolean = true) => {
        if (node.rowIndex === null) return;
        if (selectOnClick || e.metaKey || e.shiftKey) {
          tree.dispatch(select(node.rowIndex, e.metaKey, e.shiftKey));
        } else {
          tree.dispatch(select(null, false, false));
        }
      },
      toggle: (e: MouseEvent) => {
        e.stopPropagation();
        tree.onToggle(node.id, !node.isOpen);
      },
      edit: () => {
        tree.dispatch(edit(node.id));
      },
      submit: (name: string) => {
        if (name.trim()) tree.onEdit(node.id, name);
        tree.dispatch(edit(null));
      },
      reset: () => {
        tree.dispatch(edit(null));
      },
    };
  }, [tree, node]);

  const Renderer = useMemo(() => {
    return memo(tree.renderer);
  }, [tree.renderer]);

  return (
    <Renderer
      innerRef={ref}
      data={node.model}
      styles={styles}
      state={state}
      handlers={handlers}
      preview={false}
      tree={tree.monitor}
    />
  );
});
