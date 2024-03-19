import { TreeController } from "../controllers/tree-controller";

export function useListInnerStyle(tree: TreeController<any>, style: any) {
  return {
    ...style,
    height: `${parseFloat(style.height) + tree.paddingTop + tree.paddingBottom}px`,
  };
}
