import { NodeObject } from "../nodes/types";
import { VisibleState } from "./types";

export function useFilter<T>(nodeObjects: NodeObject<T>[], searchTerm: string) {
  const term = searchTerm.trim();
  const value: VisibleState = {};

  function checkVisibility(nodeObjects: NodeObject<T>[] | null) {
    if (!nodeObjects) return;
    for (const nodeObject of nodeObjects) {
      if (isMatch(nodeObject.sourceData, term)) {
        value[nodeObject.id] = true;
        for (const id of getAncestorIds(nodeObject)) value[id] = true;
      } else {
        value[nodeObject.id] = false;
      }
      checkVisibility(nodeObject.children);
    }
  }

  if (term.length > 0) checkVisibility(nodeObjects);

  return { value, onChange: () => {} };
}

function isMatch<T>(sourceData: T, searchTerm: string) {
  const haystack = Array.from(Object.values(sourceData as any))
    .filter((value) => typeof value === "string")
    .join(" ")
    .toLocaleLowerCase();
  const needle = searchTerm.toLocaleLowerCase();

  return haystack.includes(needle);
}

function getAncestorIds(nodeObject: NodeObject<any>) {
  const ids = [];
  let parent = nodeObject.parent;
  while (parent) {
    ids.push(parent.id);
    parent = parent.parent;
  }
  return ids;
}
