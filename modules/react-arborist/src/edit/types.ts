import { PartialController } from "../types/utils.js";

export type EditState = string | null;

export type EditOnChangeEvent = { value: EditState };

export type EditPartialController = PartialController<
  EditState,
  EditOnChangeEvent
>;
