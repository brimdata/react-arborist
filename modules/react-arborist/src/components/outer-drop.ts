import { ReactElement } from "react";
import { useOuterDrop } from "../dnd/outer-drop-hook";

export function OuterDrop(props: { children: ReactElement,accept?:string[]}) {
  useOuterDrop(props.accept);
  return props.children;
}
