import { PartialController } from "../types/utils";

export type EditState = string | null;

export type EditOnChangeEvent = { value: EditState };

export type EditPartialController = PartialController<
  EditState,
  EditOnChangeEvent
>;
