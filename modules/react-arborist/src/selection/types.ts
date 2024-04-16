import { TreeController } from "../controllers/tree-controller.js";
import { PartialController } from "../types/utils.js";

export type SelectionState = Record<string, boolean>;
export type SelectionOnChangeEvent<T> =
  | { type: "select"; id: string }
  | { type: "select-multi"; id: string }
  | { type: "select-contiguous"; id: string; tree: TreeController<T> }
  | { type: "deselect"; id: string }
  | { type: "select-all"; tree: TreeController<T> };

export type SelectionPartialController<T> = PartialController<
  SelectionState,
  SelectionOnChangeEvent<T>
>;
