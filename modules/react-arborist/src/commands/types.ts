import { TreeController } from "../controllers/tree-controller";

export type CommandObject<T> = {
  [name: string]: CommandBody<T>;
};

export type CommandBody<T> = (tree: TreeController<T>) => void;
