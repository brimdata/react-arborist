import "./app.css";
import { GotLineage } from "./got";

export default function App() {
  const code = `
<Tree
  ref={(tree: TreeApi) => {
    // @ts-ignore
    global.tree = tree;
  }}
  className="react-aborist"
  data={backend.data}
  getChildren="children"
  isOpen="isOpen"
  disableDrop={(d) => d.name === "House Arryn"}
  hideRoot
  indent={24}
  onMove={backend.onMove}
  onToggle={backend.onToggle}
  onEdit={backend.onEdit}
  rowHeight={22}
  width={props.width}
  height={props.height}
  onClick={() => console.log("clicked the tree")}
  onContextMenu={() => console.log("context menu the tree")}
>
  {Node}
</Tree>              

  `;
  return (
    <div className="example">
      <main>
        <h1>React Arborist</h1>
        <p>
          In this demo, we have the Game of Thrones family tree rendered with
          the <code>Tree</code> component. You can drag and drop the items in
          the tree, except in the first folder because we've marked it disabled.
          Select an item and click the pen icon to edit the text. Hold down a
          meta key to select multiple.
        </p>
        <section className="got-lineage">
          <GotLineage />
        </section>
        <code>
          <pre>{code}</pre>
        </code>
      </main>
      <p>
        From here, head over to the{" "}
        <a href="https://github.com/brimdata/react-arborist">docs</a> or look at
        the source for this{" "}
        <a href="https://github.com/brimdata/react-arborist/tree/main/packages/demo">
          demo
        </a>
        .
      </p>
    </div>
  );
}
