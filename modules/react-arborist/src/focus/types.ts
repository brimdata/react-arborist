import { PartialController } from "../types/utils.js";

export type FocusState = {
  id: string | null;
  isWithinTree: boolean;
};

export type FocusOnChangeEvent =
  | { type: "tree-focus" }
  | { type: "tree-blur" }
  | { type: "node-focus"; id: string };

export type FocusPartialController = PartialController<
  FocusState,
  FocusOnChangeEvent
>;
