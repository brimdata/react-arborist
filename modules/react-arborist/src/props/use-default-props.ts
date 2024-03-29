import { useCursor } from "../cursor/use-cursor";
import { useDnd } from "../dnd/use-dnd";
import { useEdit } from "../edit/use-edit";
import { useFocus } from "../focus/use-focus";
import { defaultNodeObjects } from "../nodes/default-node-objects";
import { useNodes } from "../nodes/use-nodes";
import { useOpens } from "../opens/use-opens";
import { useMultiSelection } from "../selection/use-multi-selection";
import { TreeViewProps } from "../types/tree-view-props";

export function useDefaultProps<T>(
  props: Partial<TreeViewProps<T>>,
): TreeViewProps<T> {
  return {
    nodes: props.nodes ?? useNodes<T>(defaultNodeObjects as T[]),
    opens: props.opens ?? useOpens(),
    edit: props.edit ?? useEdit(),
    selection: props.selection ?? useMultiSelection(),
    dnd: props.dnd ?? useDnd(),
    cursor: props.cursor ?? useCursor(),
    focus: props.focus ?? useFocus(),
    visible: props.visible ?? { value: {}, onChange: () => {} },

    width: props.width ?? 300,
    height: props.height ?? 500,
    indent: props.indent ?? 24,
    rowHeight: props.rowHeight ?? 32,
    paddingTop: props.paddingTop ?? props.padding ?? 0,
    paddingBottom: props.paddingBottom ?? props.padding ?? 0,
    padding: props.padding ?? 0,
    overscanCount: props.overscanCount ?? 1,

    className: props.className,
    rowClassName: props.rowClassName,

    openByDefault: props.openByDefault ?? true,
  };
}
