import { useState } from "react";
import { FocusPartialController, FocusState } from "./types.js";

export function useFocus(): FocusPartialController {
  const [value, setValue] = useState<FocusState>({
    isWithinTree: false,
    id: null,
  });

  return {
    value,
    onChange(e) {
      switch (e.type) {
        case "tree-focus":
          setValue((prev) => ({ ...prev, isWithinTree: true }));
          break;
        case "tree-blur":
          setValue((prev) => ({ ...prev, isWithinTree: false }));
          break;
        case "node-focus":
          setValue({ isWithinTree: true, id: e.id });
          break;
      }
    },
  };
}
