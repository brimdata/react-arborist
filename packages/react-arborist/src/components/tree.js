"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const react_1 = require("react");
const react_dnd_1 = require("react-dnd");
const react_dnd_html5_backend_1 = require("react-dnd-html5-backend");
const react_window_1 = require("react-window");
const context_1 = require("../context");
const enrich_tree_1 = require("../data/enrich-tree");
const outer_drop_hook_1 = require("../dnd/outer-drop-hook");
const provider_1 = require("../provider");
const utils_1 = require("../utils");
const drop_cursor_1 = require("./drop-cursor");
const preview_1 = require("./preview");
const row_1 = require("./row");
const OuterElement = (0, react_1.forwardRef)(function Outer(props, ref) {
    const { children, ...rest } = props;
    const tree = (0, context_1.useStaticContext)();
    return (
    // @ts-ignore
    <div ref={ref} {...rest}>
      <div style={{
            height: tree.api.visibleNodes.length * tree.rowHeight,
            width: "100%",
            overflow: "hidden",
            position: "absolute",
            left: "0",
            right: "0",
        }}>
        <drop_cursor_1.DropCursor />
      </div>
      {children}
    </div>);
});
function List(props) {
    const tree = (0, context_1.useStaticContext)();
    return (<div style={{ height: tree.height, width: tree.width, overflow: "hidden" }} onClick={props.onClick} onContextMenu={props.onContextMenu}>
      <react_window_1.FixedSizeList className={props.className} outerRef={tree.listEl} itemCount={tree.api.visibleNodes.length} height={tree.height} width={tree.width} itemSize={tree.rowHeight} itemKey={(index) => { var _a; return ((_a = tree.api.visibleNodes[index]) === null || _a === void 0 ? void 0 : _a.id) || index; }} outerElementType={OuterElement} 
    // @ts-ignore
    ref={tree.list}>
        {row_1.Row}
      </react_window_1.FixedSizeList>
    </div>);
}
function OuterDrop(props) {
    (0, outer_drop_hook_1.useOuterDrop)();
    return props.children;
}
exports.Tree = (0, react_1.forwardRef)(function Tree(props, ref) {
    const root = (0, react_1.useMemo)(() => (0, enrich_tree_1.enrichTree)(props.data, props.hideRoot, props.getChildren, props.isOpen, props.disableDrag, props.disableDrop, props.openByDefault), [
        props.data,
        props.hideRoot,
        props.getChildren,
        props.isOpen,
        props.disableDrag,
        props.disableDrop,
        props.openByDefault,
    ]);
    return (<provider_1.TreeViewProvider imperativeHandle={ref} root={root} listEl={(0, react_1.useRef)(null)} renderer={props.children} width={props.width === undefined ? 300 : props.width} height={props.height === undefined ? 500 : props.height} indent={props.indent === undefined ? 24 : props.indent} rowHeight={props.rowHeight === undefined ? 24 : props.rowHeight} onMove={props.onMove || utils_1.noop} onToggle={props.onToggle || utils_1.noop} onEdit={props.onEdit || utils_1.noop}>
      <react_dnd_1.DndProvider backend={react_dnd_html5_backend_1.HTML5Backend}>
        <OuterDrop>
          <List className={props.className} onClick={props.onClick}/>
        </OuterDrop>
        <preview_1.Preview />
      </react_dnd_1.DndProvider>
    </provider_1.TreeViewProvider>);
});
