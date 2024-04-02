import { TreeView, useNodes, useFilter } from "react-arborist";
import { gmailData } from "../data/gmail";
import { useState } from "react";

export default function Version4() {
  const [searchTerm, setSearchTerm] = useState("");
  const nodes = useNodes(gmailData);
  const visible = useFilter(nodes.value, searchTerm);

  return (
    <div className="wrap">
      <div className="region flow">
        <TreeView nodes={nodes} visible={visible} className="tree" />
        <input
          type="search"
          value={searchTerm}
          placeholder="Search tree..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
