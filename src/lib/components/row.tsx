import React, { CSSProperties, memo, MouseEvent, useMemo, useRef } from "react";
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

  const props = useMemo(
    () => ({
      style,
      ref: (n: HTMLDivElement | null) => {
        el.current = n;
        dragRef(dropRef(n));
      },
    }),
    [style, dragRef, dropRef]
  );

  const handlers = useMemo(() => {
    return {
      toggleIsSelected: (e: MouseEvent) => {
        if (node.rowIndex === null) return;
        treeView.dispatch(select(node.rowIndex, e.metaKey, e.shiftKey));
      },
      toggleIsOpen: (e: MouseEvent) => {
        e.stopPropagation();
        node.isOpen ? treeView.onClose(node.id) : treeView.onOpen(node.id);
      },
      toggleIsEditing: () => {
        if (isEditing) {
          treeView.dispatch(edit(null));
        } else {
          treeView.dispatch(edit(node.id));
        }
      },
      rename: (name: string) => {
        if (name.trim()) treeView.onRename(node.id, name);
        treeView.dispatch(edit(null));
      },
    };
  }, [treeView, node, isEditing]);

  const Renderer = useMemo(() => {
    return memo(treeView.renderer);
  }, [treeView.renderer]);

  return (
    <Renderer
      preview={false}
      node={node}
      props={props}
      state={state}
      indent={treeView.indent * node.level}
      handlers={handlers}
    />
  );
});
