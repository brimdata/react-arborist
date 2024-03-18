import { TreeController } from "../controllers/tree-controller";
import { PartialController } from "../types/utils";

export type SelectionState = Record<string, boolean>;
export type SelectionOnChange<T> =
  | { type: "select"; id: string }
  | { type: "select-multi"; id: string }
  | { type: "select-contiguous"; id: string; tree: TreeController<T> }
  | { type: "deselect"; id: string }
  | { type: "select-all"; tree: TreeController<T> };

export type SelectionPartialController<T> = PartialController<
  SelectionState,
  SelectionOnChange<T>
>;
