"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preview = void 0;
const react_1 = __importStar(require("react"));
const react_dnd_1 = require("react-dnd");
const context_1 = require("../context");
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
function Preview() {
    const { offset, mouse, item, isDragging } = (0, react_dnd_1.useDragLayer)((m) => ({
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
exports.Preview = Preview;
const Overlay = (0, react_1.memo)(function Overlay(props) {
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
const PreviewNode = (0, react_1.memo)(function PreviewNode(props) {
    const tree = (0, context_1.useStaticContext)();
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
