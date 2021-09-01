import { Dispatch, MutableRefObject, useEffect } from "react";
import { Action, stepDown, stepUp } from "../reducer";

export function useSelectionKeys(
  ref: MutableRefObject<HTMLDivElement | null>,
  dispatch: Dispatch<Action>,
  ids: string[]
) {
  useEffect(() => {
    const el = ref.current;
    el?.setAttribute("tabindex", "0");
    const cb = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") {
        e.preventDefault();
        dispatch(stepDown(e.shiftKey, ids));
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        dispatch(stepUp(e.shiftKey, ids));
      }
    };
    el?.addEventListener("keydown", cb);
    return () => {
      el?.removeEventListener("keydown", cb);
    };
  }, [ref, dispatch, ids]);
}
