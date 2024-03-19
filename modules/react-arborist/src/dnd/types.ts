import { PartialController } from "../types/utils";

export type DndState = {
  dragIds: string[];
  destinationParentId: string | null;
  destinationIndex: number | null;
};

export type DndOnChangeEvent<T> =
  | {
      type: "drag-start";
      dragIds: string[];
    }
  | {
      type: "dragging-over";
      destinationParentId: string | null;
      destinationIndex: number | null;
    }
  | {
      type: "drag-end";
    };

export type DndPartialController<T> = PartialController<
  DndState,
  DndOnChangeEvent<T>
>;
