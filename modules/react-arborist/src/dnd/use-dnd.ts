import { DndPartialController, DndState } from "./types";
import { useState } from "react";

function getInitialState(): DndState {
  return { dragIds: [], destinationParentId: null, destinationIndex: null };
}

export function useDnd(): DndPartialController {
  const [value, setValue] = useState(getInitialState);
  return {
    value: value,
    onChange: (e) => {
      switch (e.type) {
        case "drag-start":
          setValue((prev) => ({ ...prev, dragIds: e.dragIds }));
          break;
        case "dragging-over":
          setValue((prev) => ({
            ...prev,
            destinationParentId: e.destinationParentId,
            destinationIndex: e.destinationIndex,
          }));
          break;
        case "drag-end":
          setValue(getInitialState());
          break;
      }
    },
  };
}
