import { useState } from "react";
import {
  SelectionOnChangeEvent,
  SelectionPartialController,
  SelectionState,
} from "./types.js";

export function useMultiSelection<T>(): SelectionPartialController<T> {
  const [anchor, setAnchor] = useState<string | null>(null);
  const [mostRecent, setMostRecent] = useState<string | null>(null);
  const [value, setValue] = useState<SelectionState>({});

  function onChange(e: SelectionOnChangeEvent<T>) {
    switch (e.type) {
      case "select":
        setValue({ [e.id]: true });
        setAnchor(e.id);
        setMostRecent(e.id);
        break;

      case "deselect":
        setValue((prev: any) => ({ ...prev, [e.id]: false }));
        break;

      case "select-multi":
        setValue((prev: any) => ({ ...prev, [e.id]: true }));
        setAnchor(e.id);
        setMostRecent(e.id);
        break;

      case "select-contiguous":
        const next = { ...value };
        for (const node of e.tree.nodesBetween(anchor, mostRecent)) {
          next[node.id] = false;
        }
        for (const node of e.tree.nodesBetween(anchor, e.id)) {
          next[node.id] = true;
        }
        setMostRecent(e.id);
        setValue(next);
        break;

      case "select-all":
        const all: Record<string, boolean> = {};
        for (const node of e.tree.rows) {
          all[node.id] = true;
        }
        setAnchor(e.tree.firstNode?.id || null);
        setMostRecent(e.tree.lastNode?.id || null);
        setValue(all);
    }
  }

  return { value, onChange };
}
