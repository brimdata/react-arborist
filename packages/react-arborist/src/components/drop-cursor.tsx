import { useTreeApi } from "../context";

export function DropCursor() {
  const tree = useTreeApi();
  const cursor = tree.state.cursor;
  if (!cursor || cursor.type !== "line") return null;
  const indent = tree.indent;
  const top = tree.rowHeight * cursor.index;
  const left = indent * cursor.level;

  return tree.renderDropCursor({ top, left, indent });
}
