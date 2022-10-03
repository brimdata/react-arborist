import clsx from "clsx";
import { useEffect, useRef } from "react";
import { NodeRendererProps, Tree, useUncontrolledTree } from "react-arborist";
import styles from "styles/Tree.module.css";
import { useTreeController } from "./use-tree-controller";

type Data = { id: string; name: string; children?: Data[] };
const data: Data[] = {
  //@ts-ignore
  id: "ROOT",
  name: "root",
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
      ref={props.dragHandle}
      style={props.style}
      className={clsx(styles.node, {
        [styles.isSelected]: props.node.isSelected,
      })}
    >
      <p
        onClick={(e) => {
          e.stopPropagation();
          props.node.toggle();
        }}
      >
        {props.node.isLeaf ? "🌲" : props.node.isOpen ? "🗁" : "🗀"}
      </p>
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
  const [theData, controller] = useTreeController(data);
  return (
    <div className={styles.layout}>
      <h1>Simple Tree</h1>
      <input type="text" />
      <Tree
        className={styles.tree}
        data={theData}
        onCreate={controller.create}
        onRename={controller.rename}
        onMove={controller.move}
        selectionFollowsFocus
      >
        {MyNode}
      </Tree>
      <input type="text" />
    </div>
  );
}
