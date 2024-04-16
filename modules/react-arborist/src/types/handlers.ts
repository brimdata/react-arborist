import { NodeController } from "../controllers/node-controller.js";
import { IdObj } from "./utils.js";

export type CreateHandler<T> = (args: {
  parentId: string | null;
  parentNode: NodeController<T> | null;
  index: number;
  type: "internal" | "leaf";
}) => (IdObj | null) | Promise<IdObj | null>;

export type MoveHandler<T> = (args: {
  dragIds: string[];
  dragNodes: NodeController<T>[];
  parentId: string | null;
  parentNode: NodeController<T> | null;
  index: number;
}) => void | Promise<void>;

export type RenameHandler<T> = (args: {
  id: string;
  name: string;
  node: NodeController<T>;
}) => void | Promise<void>;

export type DeleteHandler<T> = (args: {
  ids: string[];
  nodes: NodeController<T>[];
}) => void | Promise<void>;

export type EditResult =
  | { cancelled: true }
  | { cancelled: false; value: string };
