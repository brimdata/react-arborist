import clsx from "clsx";
import nodeTest from "node:test";
import { useEffect, useRef } from "react";
import { NodeRendererProps, Tree } from "react-arborist";
import { NodeInterface } from "react-arborist/dist/node-interface";
import styles from "../styles/Tree.module.css";

type Data = { id: string; name: string; children?: Data[] };
const data: Data = {
  id: "root",
  name: "The Root of the Tree",
  children: [
    { id: "1", name: "Philosophy" },
    {
      id: "2",
      name: "Stoics",
      children: [
        { id: "3", name: "Creative Work" },
        { id: "4", name: "Trees", children: [{ id: "5", name: "Water" }] },
      ],
    },
    {
      id: "6",
      name: "Mystics",
      children: [
        { id: "7", name: "RR" },
        { id: "8", name: "Tom", children: [{ id: "9", name: "Walter" }] },
      ],
    },
  ],
};

function MyNode(props: NodeRendererProps<Data>) {
  return (
    <div
      style={props.style}
      className={clsx(styles.node, {
        [styles.isSelected]: props.node.isSelected,
      })}
    >
      <p>{props.node.isLeaf ? "🌲" : props.node.isOpen ? "🗁" : "🗀"}</p>
      {props.node.isEditing ? <Edit {...props} /> : <Show {...props} />}
    </div>
  );
}

function Show(props: NodeRendererProps<Data>) {
  return (
    <>
      <p className={styles.content}>{props.node.data.name}</p>
    </>
  );
}

function Edit({ node }: NodeRendererProps<Data>) {
  const input = useRef<any>();

  useEffect(() => {
    input.current?.focus();
    input.current?.select();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        node.submit(input.current?.value || "");
      }}
    >
      <input
        onBlur={() => node.reset()}
        ref={input}
        defaultValue={node.data.name}
        onKeyDown={(e) => {
          if (e.key === "Escape") node.reset();
        }}
      ></input>
    </form>
  );
}

export default function SimpleTree() {
  return (
    <div className={styles.layout}>
      <h1>Simple Tree</h1>
      <input type="text" />
      <Tree className={styles.tree} data={data}>
        {MyNode}
      </Tree>
      <input type="text" />
    </div>
  );
}
