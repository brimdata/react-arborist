import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { NodeRendererProps, Tree, TreeApi } from "react-arborist";
import styles from "styles/Tree.module.css";
import { cities } from "../../data/cities";

const smallData = [
  { id: "1", name: "1" },
  { id: "2", name: "2" },
  { id: "3", name: "3", children: [{ id: "child", name: "child" }] },
  { id: "4", name: "4" },
  { id: "5", name: "5" },
];

type Data = { id: string; name: string; children?: Data[] };
function MyNode(props: NodeRendererProps<Data>) {
  return (
    <div
      ref={props.dragHandle}
      style={props.style}
      className={clsx(styles.node, props.node.state)}
    >
      <p
        onClick={(e) => {
          e.stopPropagation();
          props.node.toggle();
        }}
      >
        {props.node.isLeaf ? "🌳" : props.node.isOpen ? "🗁" : "🗀"}
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
  const tree = useRef<TreeApi<any>>();
  const [current, setCurrent] = useState("1");
  const [filter, setFilter] = useState("");
  const [active, setActive] = useState("");
  const [selected, setSelected] = useState("");

  return (
    <div className={styles.layout}>
      <h1>Simple Tree</h1>
      <button onClick={() => setCurrent("Se5Bsthr5cPLoKGR2pv-e")}>
        Select Erie, Pennsylvania
      </button>
      <label>Filter</label>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
      />
      <p>Filter: {filter || "None"}</p>
      <p>Active: {active || "None"}</p>
      <p>Current: {current || "None"}</p>
      <p>Selected: {selected || "None"}</p>
      <Tree
        ref={tree}
        openByDefault={false}
        searchTerm={filter}
        selection={current}
        className={styles.tree}
        padding={20}
        initialData={cities as Data[]}
        onSelect={(selected) =>
          setSelected(selected.map((n) => n.data.name).join(", "))
        }
        onActivate={(node) => {
          setCurrent(node.id);
          setActive(node.data.name);
        }}
      ></Tree>
      <label>Another place to focus</label>
      <input type="text" />
    </div>
  );
}
