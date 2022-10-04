type IdObj = { id: string; children?: IdObj[] };

export class SimpleTree<T extends IdObj> {
  root: SimpleNode<T>;
  constructor(data: T[]) {
    this.root = createRoot<T>(data);
  }

  get data() {
    return this.root.children?.map((node) => node.data) ?? [];
  }

  create(args: { parentId: string; index: number; data: T }) {
    const parent = this.find(args.parentId);
    if (!parent) return null;
    parent.addChild(args.data, args.index);
  }

  move(args: { id: string; parentId: string; index: number }) {
    const src = this.find(args.id);
    const parent = this.find(args.parentId);
    if (!src || !parent) return;
    parent.addChild(src.data, args.index);
    src.drop();
  }

  update(args: { id: string; changes: Partial<T> }) {
    const node = this.find(args.id);
    if (node) node.update(args.changes);
  }

  drop(args: { id: string }) {
    const node = this.find(args.id);
    if (node) node.drop();
  }

  find(id: string, node: SimpleNode<T> = this.root): SimpleNode<T> | null {
    console.log(id, node);
    if (!node) return null;
    if (node.id === id) return node as SimpleNode<T>;
    if (node.children) {
      for (let child of node.children) {
        const found = this.find(id, child);
        if (found) return found;
      }
      return null;
    }
    return null;
  }
}

function createRoot<T extends IdObj>(data: T[]) {
  const root = new SimpleNode<T>({ id: "ROOT" } as T, null);
  root.children = data.map((d) => createNode(d as T, root));
  return root;
}

function createNode<T extends IdObj>(data: T, parent: SimpleNode<T>) {
  const node = new SimpleNode<T>(data, parent);
  if (data.children)
    node.children = data.children.map((d) => createNode<T>(d as T, node));
  return node;
}

class SimpleNode<T extends IdObj> {
  id: string;
  children?: SimpleNode<T>[];
  constructor(public data: T, public parent: SimpleNode<T> | null) {
    this.id = data.id;
  }

  hasParent(): this is this & { parent: SimpleNode<T> } {
    return !!this.parent;
  }

  get childIndex(): number {
    return this.hasParent() ? this.parent.children!.indexOf(this) : -1;
  }

  addChild(data: T, index: number) {
    const node = createNode(data, this);
    this.children = this.children ?? [];
    this.children.splice(index, 0, node);
    this.data.children = this.data.children ?? [];
    this.data.children.splice(index, 0, data);
  }

  removeChild(index: number) {
    this.children?.splice(index, 1);
    this.data.children?.splice(index, 1);
  }

  update(changes: Partial<T>) {
    if (this.hasParent()) {
      const i = this.childIndex;
      this.parent.addChild({ ...this.data, ...changes }, i);
      this.drop();
    }
  }

  drop() {
    if (this.hasParent()) this.parent.removeChild(this.childIndex);
  }
}
