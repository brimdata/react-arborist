import { TreeController } from "../controllers/tree-controller";
import { TreeViewProps } from "../types/tree-view-props";

export function TreeView<T>(props: TreeViewProps<T>) {
  const tree = new TreeController<T>(props);
  return (
    <div>
      {tree.rows.map((node) => {
        return <p>{node.object.sourceData.name}</p>;
      })}
    </div>
  );
}
