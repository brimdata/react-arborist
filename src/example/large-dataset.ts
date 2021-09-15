import { MyData } from "./backend";

export function makeLargeData(): MyData {
  const root: MyData = { id: "ROOT", name: "ROOT", isOpen: true, children: [] };

  for (let i = 0; i < 1000; i++) {
    const node: MyData = {
      id: i.toString(),
      name: i.toString(),
      isOpen: true,
      children: [],
    };
    for (let j = 0; j < 10; j++) {
      node.children!.push({
        id: i.toString() + "." + j.toString(),
        name: i.toString() + "." + j.toString(),
        isOpen: true,
      } as MyData);
    }
    root.children!.push(node);
  }

  return root;
}
