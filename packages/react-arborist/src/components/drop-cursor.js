"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropCursor = void 0;
const react_1 = __importDefault(require("react"));
const context_1 = require("../context");
function DropCursor() {
    const treeView = (0, context_1.useStaticContext)();
    const cursor = (0, context_1.useCursorLocation)();
    if (!cursor || cursor.type !== "line")
        return null;
    const top = treeView.rowHeight * cursor.index;
    const left = treeView.indent * cursor.level;
    const style = {
        position: "absolute",
        pointerEvents: "none",
        top: top - 2 + "px",
        left: treeView.indent + left + "px",
        right: treeView.indent + "px",
    };
    return <DefaultCursor style={style}/>;
}
exports.DropCursor = DropCursor;
const placeholderStyle = {
    display: "flex",
    alignItems: "center",
};
const lineStyle = {
    flex: 1,
    height: "2px",
    background: "#4B91E2",
    borderRadius: "1px",
};
const circleStyle = {
    width: "4px",
    height: "4px",
    boxShadow: "0 0 0 3px #4B91E2",
    borderRadius: "50%",
};
function DefaultCursor({ style }) {
    return (<div style={{ ...placeholderStyle, ...style }}>
      <div style={{ ...circleStyle }}></div>
      <div style={{ ...lineStyle }}></div>
    </div>);
}
