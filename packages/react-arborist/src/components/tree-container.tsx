import React from "react";
import { useTreeApi } from "../context";
import { DefaultContainer } from "./default-container";
import { shortcutHandlers } from "../shortcuts";

export function TreeContainer() {
  const tree = useTreeApi();
  const Container = tree.props.renderContainer || DefaultContainer;
  return (
    <>
      <Container shortcutHandlers={tree.props.shortcutHandlers || shortcutHandlers} />
    </>
  );
}
