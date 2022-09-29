export class DataManager<T> {
  constructor(data: T | T[]) {}

  get nodes() {
    return []; //  TreeNode classes
  }

  at(index: number) {
    return this.nodes[index];
  }
}
