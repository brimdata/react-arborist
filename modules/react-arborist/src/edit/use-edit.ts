import { useState } from "react";
import { EditPartialController, EditState } from "./types.js";

export function useEdit(): EditPartialController {
  const [value, setValue] = useState<EditState>(null);

  return {
    value,
    onChange: (e) => setValue(e.value),
  };
}
