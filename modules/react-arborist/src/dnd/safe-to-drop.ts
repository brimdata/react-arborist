import { TreeController } from "../controllers/tree-controller.js";

export function safeToDrop(tree: TreeController<any>) {
  const targetParentNode = tree.dropTargetParentNode;
  const targetIndex = tree.dropTargetIndex;
  const dragNodes = tree.dragNodes;

  /* Basic Defaul Check */
  if (targetParentNode === null && targetIndex === null) return false;

  for (const draggingNode of tree.dragNodes) {
    if (
      draggingNode.isInternal &&
      targetParentNode?.isDescendantOf(draggingNode)
    ) {
      return false;
    }
  }

  /* User Provided Check */
  const disableCheck = tree.props.disableDrop;
  if (typeof disableCheck == "function") {
    return !disableCheck({ dragNodes, targetParentNode, targetIndex });
  } else if (typeof disableCheck == "string" && targetParentNode) {
    return !targetParentNode.data[disableCheck];
  } else if (typeof disableCheck === "boolean") {
    return !disableCheck;
  } else {
    return true;
  }
}
