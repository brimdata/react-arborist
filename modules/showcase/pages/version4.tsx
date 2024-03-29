import { TreeView, useNodes, useFilter } from "react-arborist";
import { gmailData } from "../data/gmail";
import { useState } from "react";

export default function Version4() {
  const [searchTerm, setSearchTerm] = useState("");
  const nodes = useNodes(gmailData);
  const visible = useFilter(nodes.value, searchTerm);
  console.log(visible);
  return (
    <div>
      <TreeView nodes={nodes} visible={visible} />
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
