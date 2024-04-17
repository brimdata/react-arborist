import { DndPartialController, DndState } from "./types.js";
import { useState } from "react";

function getInitialState(): DndState {
  return {
    dragSourceId: null,
    dragItems: [],
    targetParentId: null,
    targetIndex: null,
  };
}

export function useDnd(): DndPartialController {
  const [value, setValue] = useState<DndState>(getInitialState);
  return {
    value: value,
    onChange: (e) => {
      switch (e.type) {
        case "drag-start":
          setValue({
            dragSourceId: e.dragSourceId,
            dragItems: e.dragItems,
            targetIndex: null,
            targetParentId: null,
          });
          break;
        case "dragging-over":
          setValue((prev) => ({
            ...prev,
            targetParentId: e.targetParentId,
            targetIndex: e.targetIndex,
          }));
          break;
        case "drag-end":
          setValue(getInitialState());
          break;
      }
    },
  };
}
