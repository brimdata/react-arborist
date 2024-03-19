import { NodeController } from "../controllers/node-controller";
import { PartialController } from "../types/utils";

export type DndState = {
  dragSourceId: string | null;
  dragItems: string[];
  targetParentId: string | null;
  targetIndex: number | null;
};

export type DndOnChangeEvent =
  | {
      type: "drag-start";
      dragSourceId: string;
      dragItems: string[];
    }
  | {
      type: "dragging-over";
      targetParentId: string | null;
      targetIndex: number | null;
    }
  | {
      type: "drag-end";
    };

export type DndPartialController = PartialController<
  DndState,
  DndOnChangeEvent
>;

export type DisableDropCheck<T> = (args: {
  dragNodes: NodeController<T>[];
  targetParentNode: NodeController<T> | null;
  targetIndex: number | null;
}) => boolean;