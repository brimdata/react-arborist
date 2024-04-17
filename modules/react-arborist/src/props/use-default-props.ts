import * as defaultCommands from "../commands/default-commands.js";
import { DefaultCursorRenderer } from "../components/default-cursor.js";
import {
  DefaultNodeRenderer,
  DefaultRowRenderer,
} from "../components/tree-view.js";
import { useCursor } from "../cursor/use-cursor.js";
import { useDnd } from "../dnd/use-dnd.js";
import { useEdit } from "../edit/use-edit.js";
import { useFocus } from "../focus/use-focus.js";
import { defaultNodeObjects } from "../nodes/default-node-objects.js";
import { useNodes } from "../nodes/use-nodes.js";
import { useOpens } from "../opens/use-opens.js";
import { useMultiSelection } from "../selection/use-multi-selection.js";
import { defaultShortcuts } from "../shortcuts/default-shortcuts.js";
import { TreeViewProps } from "../types/tree-view-props.js";

export function useDefaultProps<T>(
  props: Partial<TreeViewProps<T>>,
): TreeViewProps<T> {
  return {
    /* Partial State Controllers */
    nodes: props.nodes ?? useNodes<T>(defaultNodeObjects as T[]),
    opens: props.opens ?? useOpens(),
    edit: props.edit ?? useEdit(),
    selection: props.selection ?? useMultiSelection(),
    dnd: props.dnd ?? useDnd(),
    cursor: props.cursor ?? useCursor(),
    focus: props.focus ?? useFocus(),
    visible: props.visible ?? { value: {}, onChange: () => {} },

    /* Commands and Shortcuts */
    shortcuts: props.shortcuts ?? defaultShortcuts,
    commands: props.commands ?? defaultCommands,

    /* Dimensions */
    width: props.width ?? 300,
    height: props.height ?? 500,
    indent: props.indent ?? 24,
    rowHeight: props.rowHeight ?? 32,
    paddingTop: props.paddingTop ?? props.padding ?? 0,
    paddingBottom: props.paddingBottom ?? props.padding ?? 0,
    padding: props.padding ?? 0,
    overscanCount: props.overscanCount ?? 1,
    direction: "ltr",

    /* Renderers */
    renderRow: props.renderRow ?? DefaultRowRenderer,
    renderNode: props.renderNode ?? DefaultNodeRenderer,
    renderCursor: props.renderCursor ?? DefaultCursorRenderer,

    /* Callbacks */
    onScroll: props.onScroll ?? (() => {}),

    /* Class names */
    className: props.className,
    rowClassName: props.rowClassName,

    /* Flags */
    openByDefault: props.openByDefault ?? true,
  };
}
