type KeyPressData = {
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
};

export class Press {
  constructor(public event: KeyPressData) {}

  toArray() {
    let array = [];
    if (this.event.ctrlKey) array.push("Control");
    if (this.event.altKey) array.push("Alt");
    if (this.event.shiftKey) array.push("Shift");
    if (this.event.metaKey) array.push("Meta");
    if (!array.includes(this.event.key)) array.push(this.event.key);
    return array;
  }

  toString() {
    return this.toArray().join("+");
  }

  isEqual(shortcutKey: string) {
    const other = shortcutKey.split("+").sort().join();
    const mine = this.toArray().sort().join();
    return mine === other;
  }
}
