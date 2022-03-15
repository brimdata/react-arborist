"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEditingId = exports.EditingIdContext = exports.useIsSelected = exports.useSelectedIds = exports.SelectionContext = exports.useDispatch = exports.DispatchContext = exports.useStaticContext = exports.Static = exports.useCursorLocation = exports.CursorLocationContext = exports.useIsCursorOverFolder = exports.IsCursorOverFolder = exports.useCursorParentId = exports.CursorParentId = void 0;
const react_1 = require("react");
const selection_1 = require("./selection/selection");
exports.CursorParentId = (0, react_1.createContext)(null);
function useCursorParentId() {
    return (0, react_1.useContext)(exports.CursorParentId);
}
exports.useCursorParentId = useCursorParentId;
exports.IsCursorOverFolder = (0, react_1.createContext)(false);
function useIsCursorOverFolder() {
    return (0, react_1.useContext)(exports.IsCursorOverFolder);
}
exports.useIsCursorOverFolder = useIsCursorOverFolder;
exports.CursorLocationContext = (0, react_1.createContext)(null);
function useCursorLocation() {
    return (0, react_1.useContext)(exports.CursorLocationContext);
}
exports.useCursorLocation = useCursorLocation;
exports.Static = (0, react_1.createContext)(null);
function useStaticContext() {
    const value = (0, react_1.useContext)(exports.Static);
    if (!value)
        throw new Error("Context must be in a provider");
    return value;
}
exports.useStaticContext = useStaticContext;
exports.DispatchContext = (0, react_1.createContext)(null);
function useDispatch() {
    const dispatch = (0, react_1.useContext)(exports.DispatchContext);
    if (!dispatch)
        throw new Error("No dispatch provided");
    return dispatch;
}
exports.useDispatch = useDispatch;
exports.SelectionContext = (0, react_1.createContext)(null);
function useSelectedIds() {
    const value = (0, react_1.useContext)(exports.SelectionContext);
    if (!value)
        throw new Error("Must provide selection context");
    return value.ids;
}
exports.useSelectedIds = useSelectedIds;
function useIsSelected() {
    const value = (0, react_1.useContext)(exports.SelectionContext);
    if (!value)
        throw new Error("Must provide selection context");
    const s = (0, react_1.useMemo)(() => selection_1.Selection.parse(value.data, []), [value.data]);
    return (i) => s.contains(i);
}
exports.useIsSelected = useIsSelected;
exports.EditingIdContext = (0, react_1.createContext)(null);
function useEditingId() {
    return (0, react_1.useContext)(exports.EditingIdContext);
}
exports.useEditingId = useEditingId;
