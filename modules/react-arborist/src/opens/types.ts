import { PartialController } from "../types/utils.js";

export type OpensState = Record<string, boolean>;

export type OpensOnChangeEvent = {
  value: OpensState;
  type: "open" | "close";
  ids: string[];
};

export type OpensPartialController = PartialController<
  OpensState,
  OpensOnChangeEvent
>;
