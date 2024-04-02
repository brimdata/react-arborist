import { MutableRefObject, useEffect } from "react";
import { NodeController } from "../controllers/node-controller";

export function useRowFocus(
  node: NodeController<any>,
  ref: MutableRefObject<any>,
) {
  useEffect(() => {
    if (!node.isEditing && node.isFocused) {
      ref.current?.focus({ preventScroll: true });
    }
  }, [node.isEditing, node.isFocused, ref.current]);
}
