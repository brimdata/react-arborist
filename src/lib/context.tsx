import { createContext, useContext, useMemo } from "react";
import { Selection } from "./selection/selection";
import { IdObj, SelectionState, StaticContext } from "./types";

export const CursorParentId = createContext<string | null>(null);
export function useCursorParentId() {
  return useContext(CursorParentId);
}

export const Static = createContext<StaticContext<IdObj> | null>(null);
export function useStaticContext() {
  const value = useContext(Static);
  if (!value) throw new Error("Context must be in a provider");
  return value;
}

export const DispatchContext = createContext(null);
export function useDispatch() {
  const dispatch = useContext(DispatchContext);
  if (!dispatch) throw new Error("No dispatch provided");
  return dispatch;
}

export const SelectionContext = createContext<SelectionState | null>(null);
export function useSelectedIds(): string[] {
  const value = useContext(SelectionContext);
  if (!value) throw new Error("Must provide selection context");
  return value.ids;
}

export function useIsSelected(): (index: number | null) => boolean {
  const value = useContext(SelectionContext);
  if (!value) throw new Error("Must provide selection context");
  const s = useMemo(() => Selection.parse(value.data, []), [value.data]);
  return (i) => s.contains(i);
}

export const EditingIdContext = createContext<string | null>(null);
export function useEditingId(): string | null {
  return useContext(EditingIdContext);
}
