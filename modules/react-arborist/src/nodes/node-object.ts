export type NodeObject<T> = {
  id: string;
  sourceData: T;
  children: NodeObject<T>[] | null;
  parent: NodeObject<T> | null;
  isLeaf: boolean;
  level: number;
};


export function flatten(nodeObjects: NodeObject<T>[], isOpen) {
  const queue = [...nodeObjects];
  const rows = [];
  while (queue.length > 0) {
    const nodeObject = queue.shift()!;
    const node = rows.push(nodeOjbect);
    if (!nodeObject.isLeaf) {
      queue.unshift(...node.object.children!);
    }
  }
  return rows;
}
