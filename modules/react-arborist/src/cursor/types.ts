import { PartialController } from "../types/utils.js";

export type LineCursor = {
  type: "line";
  index: number;
  level: number;
};

export type HighlightCursor = {
  type: "highlight";
  id: string;
};

export type CursorState = HighlightCursor | LineCursor | null;
export type CursorOnChangeEvent = { value: CursorState };
export type CursorPartialController = PartialController<
  CursorState,
  CursorOnChangeEvent
>;
