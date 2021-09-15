import classNames from "classnames";
import React, { FocusEvent, KeyboardEvent } from "react";
import { ChevronDown, ChevronRight, FileText, Folder } from "react-feather";
import { NodeHandlers } from "../lib";
import { NodeRendererProps } from "../lib/types";
import { MyData } from "./backend";

const size = 16;
const color = "#999";

function MaybeToggleButton({ toggle, isOpen, isFolder, isSelected }: any) {
  if (isFolder) {
    const Icon = isOpen ? ChevronDown : ChevronRight;
    return (
      <button tabIndex={-1} onClick={toggle}>
        <Icon size={12} stroke={isSelected ? "white" : color} />
      </button>
    );
  } else {
    return <div className="spacer" />;
  }
}

function Icon({ isFolder, isSelected }: any) {
  if (isFolder) {
    return (
      <Folder
        className="folder"
        stroke={isSelected ? "white" : "cornflowerblue"}
        fillOpacity="0.5"
        fill={isSelected ? "white" : "cornflowerblue"}
        size={size}
      />
    );
  } else {
    return (
      <FileText
        className="file"
        stroke={isSelected ? "white" : "#333"}
        strokeOpacity={isSelected ? "0.8" : "0.4"}
        fill="none"
        size={size}
      />
    );
  }
}

export const Node = ({
  node,
  props,
  indent,
  state,
  handlers,
}: NodeRendererProps<MyData>) => {
  const folder = Array.isArray(node.children);
  const open = state.isOpen;
  const name = node.model.name;

  return (
    <div
      {...props}
      className={classNames("row", state)}
      onClick={handlers.toggleIsSelected}
    >
      <div className="row-contents" style={{ paddingLeft: indent }}>
        <MaybeToggleButton
          toggle={handlers.toggleIsOpen}
          isOpen={open}
          isFolder={folder}
          isSelected={state.isSelected}
        />
        <i>
          <Icon isFolder={folder} isSelected={state.isSelected} />
        </i>
        {state.isEditing ? (
          <RenameForm defaultValue={name} {...handlers} />
        ) : (
          <span>
            {name}{" "}
            {state.isSelected && <a onClick={handlers.toggleIsEditing}>✍️</a>}
          </span>
        )}
      </div>
    </div>
  );
};

type FormProps = { defaultValue: string } & NodeHandlers;

function RenameForm({ defaultValue, rename, toggleIsEditing }: FormProps) {
  const inputProps = {
    defaultValue,
    autoFocus: true,
    onBlur: (e: FocusEvent<HTMLInputElement>) => {
      rename(e.currentTarget.value);
    },
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          rename(e.currentTarget.value);
          break;
        case "Escape":
          toggleIsEditing();
          break;
      }
    },
  };

  return <input type="text" {...inputProps} />;
}
