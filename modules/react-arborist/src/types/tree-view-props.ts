import { NodesPartialController } from "../nodes/types.js";
import { OpensPartialController } from "../opens/types.js";
import { EditPartialController } from "../edit/types.js";
import { SelectionPartialController } from "../selection/types.js";
import { DisableDropCheck, DndPartialController } from "../dnd/types.js";
import { CursorPartialController } from "../cursor/types.js";
import { FocusPartialController } from "../focus/types.js";
import { VisiblePartialController } from "../visible/types.js";
import { ShortcutAttrs } from "../shortcuts/types.js";
import { CommandObject } from "../commands/types.js";
import { ListOnScrollProps } from "react-window";
import {
  CursorRendererProps,
  NodeRendererProps,
  RowRendererProps,
} from "./renderers.js";

export type TreeViewProps<T> = {
  /* Partial Controllers */
  nodes: NodesPartialController<T>;
  opens: OpensPartialController;
  edit: EditPartialController;
  selection: SelectionPartialController<T>;
  dnd: DndPartialController;
  cursor: CursorPartialController;
  focus: FocusPartialController;
  visible: VisiblePartialController;

  /* Commands and Shortcuts */
  shortcuts: ShortcutAttrs[];
  commands: CommandObject<T>;

  /* Dimensions and Sizes */
  width: number | string;
  height: number;
  rowHeight: number;
  indent: number;
  overscanCount: number;
  paddingTop: number;
  paddingBottom: number;
  padding: number;
  direction: "rtl" | "ltr";

  /* Callbacks */
  onScroll: (args: ListOnScrollProps) => void;

  /* Class Names */
  className?: string;
  rowClassName?: string;

  /* Configurations */
  openByDefault: boolean;
  disableDrop?: string | boolean | DisableDropCheck<T>;

  renderRow: (props: RowRendererProps<T>) => any;
  renderNode: (props: NodeRendererProps<T>) => any;
  renderCursor: (props: CursorRendererProps) => any;
};
