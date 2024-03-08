// A function that turns a string of text into a tree
// Each line is a node
// The number of spaces at the beginning indicate the level

export function makeTree(string: string) {
  const root = { id: "ROOT", name: "ROOT", isOpen: true };
  let prevNode = root;
  let prevLevel = -1;
  let id = 1;
  string.split("\n").forEach((line) => {
    const name = line.trimStart();
    const level = line.length - name.length;
    const diff = level - prevLevel;
    const node = { id: (id++).toString(), name, isOpen: false };
    if (diff === 1) {
      // First child
      //@ts-ignore
      node.parent = prevNode;
      //@ts-ignore
      prevNode.children = [node];
    } else {
      // Find the parent and go up
      //@ts-ignore
      let parent = prevNode.parent;
      for (let i = diff; i < 0; i++) {
        parent = parent.parent;
      }
      //@ts-ignore
      node.parent = parent;
      parent.children.push(node);
    }
    prevNode = node;
    prevLevel = level;
  });

  return root;
}
