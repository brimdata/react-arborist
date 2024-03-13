export type NodeObject<T> = {
  id: string;
  sourceData: T;
  children: NodeObject<T>[] | null;
  parent: NodeObject<T> | null;
  isLeaf: boolean;
  level: number;
};
