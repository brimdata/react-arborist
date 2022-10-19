import React, { useEffect, useRef } from "react";
import { NodeRendererProps } from "../types/renderers";
import { IdObj } from "../types/utils";

export function DefaultNode(props: NodeRendererProps<IdObj>) {
  return (
    <div ref={props.dragHandle} style={props.style}>
      <span
        onClick={(e) => {
          e.stopPropagation();
          props.node.toggle();
        }}
      >
        {props.node.isLeaf ? "🌳" : props.node.isOpen ? "🗁" : "🗀"}
      </span>{" "}
      {props.node.isEditing ? <Edit {...props} /> : <Show {...props} />}
    </div>
  );
}

function Show(props: NodeRendererProps<IdObj>) {
  return (
    <>
      {/* @ts-ignore */}
      <span>{props.node.data.name}</span>
    </>
  );
}

function Edit({ node }: NodeRendererProps<IdObj>) {
  const input = useRef<any>();

  useEffect(() => {
    input.current?.focus();
    input.current?.select();
  }, []);

  return (
    <input
      ref={input}
      // @ts-ignore
      defaultValue={node.data.name}
      onBlur={() => node.reset()}
      onKeyDown={(e) => {
        if (e.key === "Escape") node.reset();
        if (e.key === "Enter") node.submit(input.current?.value || "");
      }}
    ></input>
  );
}
