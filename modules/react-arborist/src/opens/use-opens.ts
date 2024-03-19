import { useState } from "react";
import { OpensPartialController, OpensState } from "./types";

export function useOpens(): OpensPartialController {
  const [value, setValue] = useState<OpensState>({});

  return {
    value,
    onChange: (e) => setValue(e.value),
  };
}
