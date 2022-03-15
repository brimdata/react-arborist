import { createContext, useContext, useMemo } from "react";
import { Selection } from "./selection/selection";
export const CursorParentId = createContext(null);
export function useCursorParentId() {
    return useContext(CursorParentId);
}
export const IsCursorOverFolder = createContext(false);
export function useIsCursorOverFolder() {
    return useContext(IsCursorOverFolder);
}
export const CursorLocationContext = createContext(null);
export function useCursorLocation() {
    return useContext(CursorLocationContext);
}
export const Static = createContext(null);
export function useStaticContext() {
    const value = useContext(Static);
    if (!value)
        throw new Error("Context must be in a provider");
    return value;
}
export const DispatchContext = createContext(null);
export function useDispatch() {
    const dispatch = useContext(DispatchContext);
    if (!dispatch)
        throw new Error("No dispatch provided");
    return dispatch;
}
export const SelectionContext = createContext(null);
export function useSelectedIds() {
    const value = useContext(SelectionContext);
    if (!value)
        throw new Error("Must provide selection context");
    return value.ids;
}
export function useIsSelected() {
    const value = useContext(SelectionContext);
    if (!value)
        throw new Error("Must provide selection context");
    const s = useMemo(() => Selection.parse(value.data, []), [value.data]);
    return (i) => s.contains(i);
}
export const EditingIdContext = createContext(null);
export function useEditingId() {
    return useContext(EditingIdContext);
}
