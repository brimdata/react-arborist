export type OpensOnChangeEvent = {
  value: Record<string, boolean>;
  type: "open" | "close";
  ids: string[];
};
