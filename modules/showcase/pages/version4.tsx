import { TreeView, useNodes } from "react-arborist";
import { gmailData } from "../data/gmail";

export default function Version4() {
  const nodes = useNodes(gmailData, {
    id: (d) => d.id,
    isLeaf: (d) => !d.children,
  });
  // return <p>hi</p>;
  return <div>{<TreeView nodes={nodes} />}</div>;
}
