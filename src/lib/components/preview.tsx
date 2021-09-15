import React, { CSSProperties } from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import { useStaticContext } from "../context";
import { DragItem } from "../types";

const layerStyles: CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

const getStyle = (offset: XYCoord | null) => {
  if (!offset) return { display: "none" };
  const { x, y } = offset;
  return { transform: `translate(${x}px, ${y}px)` };
};

const getCountStyle = (offset: XYCoord | null) => {
  if (!offset) return { display: "none" };
  const { x, y } = offset;
  return { transform: `translate(${x + 10}px, ${y + 10}px)` };
};

export function Preview() {
  const treeView = useStaticContext();

  const { item, offset, mouse, isDragging } = useDragLayer<{
    item: DragItem;
    offset: XYCoord | null;
    mouse: XYCoord | null;
    isDragging: boolean;
  }>((m) => ({
    isDragging: m.isDragging(),
    offset: m.getSourceClientOffset(),
    mouse: m.getClientOffset(),
    item: m.getItem(),
  }));

  if (!isDragging) return null;

  const node = treeView.getNode(item.id);
  if (!node) return null;

  return (
    <div style={layerStyles}>
      <div className="row preview" style={getStyle(offset)}>
        <treeView.renderer
          preview
          node={node}
          props={{ style: {}, ref: () => {} }}
          state={{
            isEditing: false,
            isSelected: false,
            isHoveringOverChild: false,
            isOpen: node.isOpen,
          }}
          indent={treeView.indent * node.level}
          handlers={{
            toggleIsEditing: () => {},
            toggleIsSelected: () => {},
            toggleIsOpen: () => {},
            rename: () => {},
          }}
        />
      </div>
      {item.dragIds.length > 1 && (
        <div className="selected-count" style={getCountStyle(mouse)}>
          {item.dragIds.length}
        </div>
      )}
    </div>
  );
}
