import { MutableRefObject, useEffect } from "react";
import { TreeApi } from "../tree-api";

export function useSelectionKeys<T>(
  ref: MutableRefObject<HTMLDivElement | null>,
  api: TreeApi<T>
) {
  useEffect(() => {
    const el = ref.current;
    const cb = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") {
        e.preventDefault();
        api.selectDownwards(e.shiftKey);
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        api.selectUpwards(e.shiftKey);
      }
    };
    el?.addEventListener("keydown", cb);
    return () => {
      el?.removeEventListener("keydown", cb);
    };
  }, [ref, api]);
}
