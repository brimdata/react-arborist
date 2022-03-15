import { forwardRef, useMemo, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FixedSizeList } from "react-window";
import { useStaticContext } from "../context";
import { enrichTree } from "../data/enrich-tree";
import { useOuterDrop } from "../dnd/outer-drop-hook";
import { TreeViewProvider } from "../provider";
import { noop } from "../utils";
import { DropCursor } from "./drop-cursor";
import { Preview } from "./preview";
import { Row } from "./row";
const OuterElement = forwardRef(function Outer(props, ref) {
    const { children, ...rest } = props;
    const tree = useStaticContext();
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
        <DropCursor />
      </div>
      {children}
    </div>);
});
function List(props) {
    const tree = useStaticContext();
    return (<div style={{ height: tree.height, width: tree.width, overflow: "hidden" }} onClick={props.onClick} onContextMenu={props.onContextMenu}>
      <FixedSizeList className={props.className} outerRef={tree.listEl} itemCount={tree.api.visibleNodes.length} height={tree.height} width={tree.width} itemSize={tree.rowHeight} itemKey={(index) => { var _a; return ((_a = tree.api.visibleNodes[index]) === null || _a === void 0 ? void 0 : _a.id) || index; }} outerElementType={OuterElement} 
    // @ts-ignore
    ref={tree.list}>
        {Row}
      </FixedSizeList>
    </div>);
}
function OuterDrop(props) {
    useOuterDrop();
    return props.children;
}
export const Tree = forwardRef(function Tree(props, ref) {
    const root = useMemo(() => enrichTree(props.data, props.hideRoot, props.getChildren, props.isOpen, props.disableDrag, props.disableDrop, props.openByDefault), [
        props.data,
        props.hideRoot,
        props.getChildren,
        props.isOpen,
        props.disableDrag,
        props.disableDrop,
        props.openByDefault,
    ]);
    return (<TreeViewProvider imperativeHandle={ref} root={root} listEl={useRef(null)} renderer={props.children} width={props.width === undefined ? 300 : props.width} height={props.height === undefined ? 500 : props.height} indent={props.indent === undefined ? 24 : props.indent} rowHeight={props.rowHeight === undefined ? 24 : props.rowHeight} onMove={props.onMove || noop} onToggle={props.onToggle || noop} onEdit={props.onEdit || noop}>
      <DndProvider backend={HTML5Backend}>
        <OuterDrop>
          <List className={props.className} onClick={props.onClick}/>
        </OuterDrop>
        <Preview />
      </DndProvider>
    </TreeViewProvider>);
});
