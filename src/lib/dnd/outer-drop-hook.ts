import { useDrop } from "react-dnd";
import { useStaticContext } from "../context";
import { setCursorLocation } from "../reducer";
import { computeDrop } from "./compute-drop";

export function useOuterDrop() {
  const tree = useStaticContext();

  // In case we drop an item at the bottom of the list
  const [, drop] = useDrop(
    () => ({
      accept: "NODE",
      hover: (item, m) => {
        if (!m.isOver({ shallow: true })) return;
        const offset = m.getClientOffset();
        if (!tree.listRef.current || !offset) return;
        const { cursor } = computeDrop({
          element: tree.listRef.current,
          offset: offset,
          indent: tree.indent,
          node: null,
          prevNode: tree.visibleNodes[tree.visibleNodes.length - 1],
          nextNode: null,
        });
        tree.dispatch(setCursorLocation(cursor));
      },
      drop: (item, m) => {
        if (m.didDrop()) return;
        console.log("drop!!");
        const offset = m.getClientOffset();
        if (!tree.listRef.current || !offset) return;
        const { parentId, index } = computeDrop({
          element: tree.listRef.current,
          offset: offset,
          indent: tree.indent,
          node: null,
          prevNode: tree.visibleNodes[tree.visibleNodes.length - 1],
          nextNode: null,
        });
        return { parentId, index };
      },
    }),
    [tree]
  );

  drop(tree.listRef);
}
