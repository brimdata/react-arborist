import clsx from "clsx";
import { useEffect, useRef } from "react";
import {
  NodeRendererProps,
  Tree,
  TreeApi,
  useSimpleTree,
} from "react-arborist";
import styles from "styles/Tree.module.css";
import { cities } from "../../data/cities";

const smallData = [
  { id: "1", name: "1" },
  { id: "2", name: "2" },
  { id: "3", name: "3`" },
  { id: "4", name: "4" },
  { id: "5", name: "5" },
];

type Data = { id: string; name: string; children?: Data[] };
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
  const [theData, controller] = useSimpleTree(smallData);

  const tree = useRef<TreeApi<any>>();

  useEffect(() => {
    // @ts-ignore
    global.tree = tree.current;
  });

  return (
    <div className={styles.layout}>
      <h1>Simple Tree</h1>
      <input type="text" />
      <Tree
        ref={tree}
        className={styles.tree}
        data={theData}
        onCreate={controller.create}
        onRename={controller.rename}
        onMove={controller.move}
        onDelete={controller.drop}
      >
        {MyNode}
      </Tree>
      <input type="text" />
    </div>
  );
}
