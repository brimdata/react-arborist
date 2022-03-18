import React, { CSSProperties, memo } from "react";
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
  const { offset, mouse, item, isDragging } = useDragLayer((m) => ({
    offset: m.getSourceClientOffset(),
    mouse: m.getClientOffset(),
    item: m.getItem(),
    isDragging: m.isDragging(),
  }));

  return (
    <Overlay isDragging={isDragging}>
      <Position offset={offset}>
        <PreviewNode item={item} />
      </Position>
      <Count mouse={mouse} item={item} />
    </Overlay>
  );
}

const Overlay = memo(function Overlay(props: {
  children: JSX.Element[];
  isDragging: boolean;
}) {
  if (!props.isDragging) return null;
  return <div style={layerStyles}>{props.children}</div>;
});

function Position(props: { children: JSX.Element; offset: XYCoord | null }) {
  return (
    <div className="row preview" style={getStyle(props.offset)}>
      {props.children}
    </div>
  );
}

function Count(props: { item: DragItem; mouse: XYCoord | null }) {
  const { item, mouse } = props;
  if (item?.dragIds?.length > 1)
    return (
      <div className="selected-count" style={getCountStyle(mouse)}>
        {item.dragIds.length}
      </div>
    );
  else return null;
}

const PreviewNode = memo(function PreviewNode(props: {
  item: DragItem | null;
}) {
  const tree = useStaticContext();
  if (!props.item) return null;
  const node = tree.api.getNode(props.item.id);
  if (!node) return null;
  return (
    <tree.renderer
      preview
      innerRef={() => {}}
      data={node.model}
      styles={{
        row: {},
        indent: { paddingLeft: node.level * tree.indent },
      }}
      tree={tree.api}
      state={{
        isDragging: false,
        isEditing: false,
        isSelected: false,
        isSelectedStart: false,
        isSelectedEnd: false,
        isHoveringOverChild: false,
        isOpen: node.isOpen,
      }}
      handlers={{
        edit: () => Promise.resolve({ cancelled: true }),
        select: () => {},
        toggle: () => {},
        submit: () => {},
        reset: () => {},
      }}
    />
  );
});
