import clsx from "clsx";
import { CursorProps, NodeApi, NodeRendererProps, Tree } from "react-arborist";
import { gmailData, GmailItem } from "../data/gmail";
import * as icons from "react-icons/md";
import styles from "../styles/gmail.module.css";
import { FillFlexParent } from "../components/fill-flex-parent";
import { SiGmail } from "react-icons/si";
import { BsTree } from "react-icons/bs";
import { useState } from "react";
import Link from "next/link";

export default function GmailSidebar() {
  const [term, setTerm] = useState("");
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <icons.MdMenu />
        <SiGmail />
        <h1>Gmail</h1>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <button className={styles.composeButton}>
            <icons.MdOutlineCreate />
            Compose
          </button>
          <FillFlexParent>
            {({ width, height }) => {
              return (
                <Tree
                  initialData={gmailData}
                  width={width}
                  height={height}
                  rowHeight={32}
                  renderCursor={Cursor}
                  searchTerm={term}
                >
                  {Node}
                </Tree>
              );
            }}
          </FillFlexParent>
        </div>
        <div className={styles.content}>
          <h1>React Arborist Style Demo</h1>
          <p>
            React Arborist can be used to create something like the gmail
            sidebar.
          </p>
          <p>The tree is fully functional. Try the following:</p>
          <ul>
            <li>Drag the items around</li>
            <li>Move focus with the arrow keys</li>
            <li>Toggle folders (press spacebar)</li>
            <li>Rename (press enter)</li>
            <li>Create a new item (press A)</li>
            <li>Create a new folder (press shift+A)</li>
            <li>Delete items (press delete)</li>
            <li>Select multiple items with shift or meta</li>
            <li>
              Filter the tree by typing in this text box:{" "}
              <input
                value={term}
                onChange={(e) => setTerm(e.currentTarget.value)}
              />
            </li>
          </ul>
          <p>
            Star it on{" "}
            <a href="https://github.com/brimdata/react-arborist">Github</a> (The
            docs are there too).
          </p>
          <p>
            Follow updates on{" "}
            <a href="https://twitter.com/specialCaseDev">Twitter</a>.
          </p>

          <p>
            <Link href="/">Back to Demos</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Node({ node, style, dragHandle }: NodeRendererProps<GmailItem>) {
  const Icon = node.data.icon || BsTree;
  return (
    <div
      ref={dragHandle}
      style={style}
      className={clsx(styles.node, node.state)}
      onClick={() => node.isInternal && node.toggle()}
    >
      <FolderArrow node={node} />
      <span>
        <Icon />
      </span>
      <span>{node.isEditing ? <Input node={node} /> : node.data.name}</span>
      <span>{node.data.unread === 0 ? null : node.data.unread}</span>
    </div>
  );
}

function Input({ node }: { node: NodeApi<GmailItem> }) {
  return (
    <input
      autoFocus
      type="text"
      defaultValue={node.data.name}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={() => node.reset()}
      onKeyDown={(e) => {
        if (e.key === "Escape") node.reset();
        if (e.key === "Enter") node.submit(e.currentTarget.value);
      }}
    />
  );
}

function FolderArrow({ node }: { node: NodeApi<GmailItem> }) {
  if (node.isLeaf) return <span></span>;
  return (
    <span>
      {node.isOpen ? <icons.MdArrowDropDown /> : <icons.MdArrowRight />}
    </span>
  );
}

function Cursor({ top, left }: CursorProps) {
  return <div className={styles.dropCursor} style={{ top, left }}></div>;
}
