import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import ReactDOM from "react-dom";
import {
  useCursorParentId,
  useEditingId,
  useFocusId,
  useIsCursorOverFolder,
  useIsSelected,
  useStaticContext,
} from "../context";
import { useDragHook } from "../dnd/drag-hook";
import { useDropHook } from "../dnd/drop-hook";
import { hasParent, isFolder } from "../utils";

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
  const isFocused = node.id === useFocusId();
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
      isFocused,
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
    isFocused,
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

  useEffect(() => {
    if (isEditing) return;
    if (isFocused) {
      el.current?.focus();
    }
  }, [isFocused, isEditing]);

  useEffect(() => {
    if (isSelected) {
      if (tree.api.getSelectedIds().length === 1) {
        tree.api.props.onSelect(node.model);
      }
    }
  }, [isSelected]);

  const attrs = useMemo(() => {
    return {
      onClick: (e: MouseEvent) => {
        if (!node.rowIndex) return;
        if (e.metaKey || e.shiftKey) {
          tree.api.select(node.rowIndex, e.metaKey, e.shiftKey);
        } else {
          tree.api.focus(node.id);
          tree.api.selectById(node.id);
        }
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          tree.api.edit(node.id);
        }
        if (e.key === "ArrowRight") {
          if (node.isOpen) {
            tree.api.focusNext(false);
          } else if (node.isFolder) {
            tree.api.open(node.id);
          }
        }
        if (e.key === "ArrowLeft") {
          if (node.isOpen) {
            tree.api.close(node.id);
          } else if (hasParent(node)) {
            tree.api.focus(node.parent!.id);
          }
        }
        if (e.key === "*") {
          tree.api.openLevel(node.level);
          ReactDOM.flushSync(() => {
            tree.api.scrollToId(node.id);
          });
        }
        if (e.key === " ") {
          // This needs to be the "Default Action"
          e.preventDefault();
          if (node.isFolder && !e.shiftKey) {
            tree.api.props.onToggle(node.id, !node.isOpen);
          } else {
            tree.api.selectById(node.id, e.metaKey, e.shiftKey);
          }
        }
      },
      ref: el,
      style: styles.row,
      tabIndex: -1,
    };
  }, [tree.api, node, el, styles]);

  return (
    <Renderer
      attrs={attrs}
      data={node.model}
      styles={styles}
      state={state}
      handlers={handlers}
      preview={false}
      tree={tree.api}
    />
  );
});
