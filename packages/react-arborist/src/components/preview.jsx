import React, { memo } from "react";
import { useDragLayer } from "react-dnd";
import { useStaticContext } from "../context";
const layerStyles = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
};
const getStyle = (offset) => {
    if (!offset)
        return { display: "none" };
    const { x, y } = offset;
    return { transform: `translate(${x}px, ${y}px)` };
};
const getCountStyle = (offset) => {
    if (!offset)
        return { display: "none" };
    const { x, y } = offset;
    return { transform: `translate(${x + 10}px, ${y + 10}px)` };
};
export function Preview() {
    const { offset, mouse, item, isDragging } = useDragLayer((m) => ({
        offset: m.getSourceClientOffset(),
        mouse: m.getClientOffset(),
        item: m.getItem(),
        isDragging: m.isDragging(),
    }));
    return (<Overlay isDragging={isDragging}>
      <Position offset={offset}>
        <PreviewNode item={item}/>
      </Position>
      <Count mouse={mouse} item={item}/>
    </Overlay>);
}
const Overlay = memo(function Overlay(props) {
    if (!props.isDragging)
        return null;
    return <div style={layerStyles}>{props.children}</div>;
});
function Position(props) {
    return (<div className="row preview" style={getStyle(props.offset)}>
      {props.children}
    </div>);
}
function Count(props) {
    var _a;
    const { item, mouse } = props;
    if (((_a = item === null || item === void 0 ? void 0 : item.dragIds) === null || _a === void 0 ? void 0 : _a.length) > 1)
        return (<div className="selected-count" style={getCountStyle(mouse)}>
        {item.dragIds.length}
      </div>);
    else
        return null;
}
const PreviewNode = memo(function PreviewNode(props) {
    const tree = useStaticContext();
    if (!props.item)
        return null;
    const node = tree.api.getNode(props.item.id);
    if (!node)
        return null;
    return (<tree.renderer preview innerRef={() => { }} data={node.model} styles={{
            row: {},
            indent: { paddingLeft: node.level * tree.indent },
        }} tree={tree.api} state={{
            isDragging: false,
            isEditing: false,
            isSelected: false,
            isFirstOfSelected: false,
            isLastOfSelected: false,
            isHoveringOverChild: false,
            isOpen: node.isOpen,
        }} handlers={{
            edit: () => { },
            select: () => { },
            toggle: () => { },
            submit: () => { },
            reset: () => { },
        }}/>);
});
