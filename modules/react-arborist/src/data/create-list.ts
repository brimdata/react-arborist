// import { NodeApi } from "../interfaces/node-api";

// Deprecated, but need this for a reference
// function flattenAndFilterTree<T>(
//   root: NodeApi<T>,
//   isMatch: (n: NodeApi<T>) => boolean,
// ): NodeApi<T>[] {
//   const matches: Record<string, boolean> = {};
//   const list: NodeApi<T>[] = [];
//
//   function markMatch(node: NodeApi<T>) {
//     const yes = !node.isRoot && isMatch(node);
//     if (yes) {
//       matches[node.id] = true;
//       let parent = node.parent;
//       while (parent) {
//         matches[parent.id] = true;
//         parent = parent.parent;
//       }
//     }
//     if (node.children) {
//       for (let child of node.children) markMatch(child);
//     }
//   }
//
//   function collect(node: NodeApi<T>) {
//     if (node.level >= 0 && matches[node.id]) {
//       list.push(node);
//     }
//     if (node.isOpen) {
//       node.children?.forEach(collect);
//     }
//   }
//
//   markMatch(root);
//   collect(root);
//   return list;
// }
