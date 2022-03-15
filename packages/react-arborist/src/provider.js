"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeViewProvider = void 0;
const react_1 = require("react");
const context_1 = require("./context");
const reducer_1 = require("./reducer");
const selection_hook_1 = require("./selection/selection-hook");
const tree_api_hook_1 = require("./tree-api-hook");
function TreeViewProvider(props) {
    const [state, dispatch] = (0, react_1.useReducer)(reducer_1.reducer, (0, reducer_1.initState)());
    const list = (0, react_1.useRef)();
    const api = (0, tree_api_hook_1.useTreeApi)(state, dispatch, props, list.current);
    (0, react_1.useImperativeHandle)(props.imperativeHandle, () => api);
    (0, selection_hook_1.useSelectionKeys)(props.listEl, api);
    const staticValue = (0, react_1.useMemo)(() => ({ ...props, api, list }), [props, api, list]);
    /**
     * This context pattern is ridiculous, next time use redux.
     */
    return (
    // @ts-ignore
    <context_1.Static.Provider value={staticValue}>
      <context_1.EditingIdContext.Provider value={state.editingId}>
        <context_1.SelectionContext.Provider value={state.selection}>
          <context_1.CursorParentId.Provider value={getParentId(state.cursor)}>
            <context_1.IsCursorOverFolder.Provider value={isOverFolder(state)}>
              <context_1.CursorLocationContext.Provider value={state.cursor}>
                {props.children}
              </context_1.CursorLocationContext.Provider>
            </context_1.IsCursorOverFolder.Provider>
          </context_1.CursorParentId.Provider>
        </context_1.SelectionContext.Provider>
      </context_1.EditingIdContext.Provider>
    </context_1.Static.Provider>);
}
exports.TreeViewProvider = TreeViewProvider;
function getParentId(cursor) {
    switch (cursor.type) {
        case "highlight":
            return cursor.id;
        default:
            return null;
    }
}
function isOverFolder(state) {
    return state.cursor.type === "highlight";
}
