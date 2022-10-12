import { IdObj } from "./utils";

export type CreateHandler = (args: {
  parentId: string | null;
  index: number;
  type: "internal" | "leaf";
}) => (IdObj | null) | Promise<IdObj | null>;

export type MoveHandler = (args: {
  dragIds: string[];
  parentId: string | null;
  index: number;
}) => void | Promise<void>;

export type RenameHandler = (args: {
  id: string;
  name: string;
}) => void | Promise<void>;

export type DeleteHandler = (args: { ids: string[] }) => void | Promise<void>;

export type EditResult =
  | { cancelled: true }
  | { cancelled: false; value: string };
