import { useState } from "react";
import { CursorPartialController, CursorState } from "./types";

export function useCursor(): CursorPartialController {
  const [value, setValue] = useState<CursorState>(null);

  return {
    value,
    onChange: (e) => setValue(e.value),
  };
}
