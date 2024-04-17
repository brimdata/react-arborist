import { NodeObject } from "../nodes/types.js";

export function matchesStringProperties<T>(node: NodeObject<T>, term: string) {
  const haystack = Array.from(Object.values(node.sourceData as any))
    .filter((value) => typeof value === "string")
    .join(" ")
    .toLocaleLowerCase();

  return haystack.includes(term.toLocaleLowerCase());
}
