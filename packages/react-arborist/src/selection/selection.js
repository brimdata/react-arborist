import { Range } from "./range";
export class Selection {
    constructor(ranges = [], currentIndex = ranges.length ? ranges.length - 1 : null, direction = "none", items = []) {
        this.ranges = [];
        this.direction = "none";
        ranges.forEach(([s, e]) => this.addRange(s, e));
        this.currentIndex = currentIndex;
        this.direction = direction;
        this.items = items;
    }
    static parse(data, items) {
        if (data) {
            return new Selection(data.ranges, data.currentIndex, data.direction, items);
        }
        else {
            return new Selection();
        }
    }
    get current() {
        if (this.currentIndex === null)
            return null;
        const range = this.ranges[this.currentIndex];
        if (!range) {
            return null;
        }
        else {
            return range;
        }
    }
    select(n) {
        if (n < 0 || n >= this.items.length)
            return;
        this.clear();
        this.currentIndex = this.addRange(n, n);
    }
    multiSelect(n) {
        if (n < 0 || n >= this.items.length)
            return;
        if (this.contains(n))
            return;
        this.currentIndex = this.addRange(n, n);
        this.compact(n);
    }
    deselect(n) {
        if (n < 0 || n >= this.items.length)
            return;
        const r = this.ranges.find((r) => r.contains(n));
        if (!r)
            return;
        else if (r.size === 1)
            this.removeRange(r);
        else if (r.start === n)
            r.start++;
        else if (r.end === n)
            r.end--;
        else {
            this.removeRange(r);
            this.addRange(r.start, n - 1);
            this.currentIndex = this.addRange(n + 1, r.end);
        }
    }
    getSelectedItems() {
        return this.ranges.flatMap((range) => range.map((index) => this.items[index]));
    }
    extend(n) {
        if (n < 0 || n >= this.items.length)
            return;
        if (this.isEmpty()) {
            this.select(n);
        }
        else {
            const anchor = this.getAnchor();
            if (anchor !== null && this.current) {
                const [start, end] = [n, anchor].sort((a, b) => a - b);
                this.current.start = start;
                this.current.end = end;
                this.compact(n);
            }
        }
    }
    contains(n) {
        if (n === null)
            return false;
        return this.ranges.some((r) => r.contains(n));
    }
    getRanges() {
        return this.ranges.map((r) => r.serialize());
    }
    clear() {
        this.ranges = [];
        this.currentIndex = null;
        this.direction = "none";
    }
    serialize() {
        return {
            ranges: this.getRanges(),
            currentIndex: this.currentIndex,
            direction: this.direction,
        };
    }
    isEqual(other) {
        if (other.ranges.length !== this.ranges.length)
            return false;
        for (let i = 0; i < this.ranges.length; ++i) {
            if (!this.ranges[i].isEqual(other.ranges[i]))
                return false;
        }
        return true;
    }
    addRange(start, end) {
        const r = new Range(start, end);
        // Keep ranges sorted by start
        const index = this.ranges.findIndex((r) => r.start >= start);
        if (index === -1)
            this.ranges.push(r);
        else
            this.ranges.splice(index, 0, r);
        return index === -1 ? this.ranges.length - 1 : index;
    }
    removeRange(r) {
        const index = this.ranges.indexOf(r);
        this.ranges.splice(index, 1);
        if (this.isEmpty()) {
            this.currentIndex = null;
        }
        else if (index === this.currentIndex) {
            this.currentIndex = this.ranges.length - 1;
        }
    }
    isEmpty() {
        return this.ranges.length === 0;
    }
    getAnchor() {
        if (!this.current)
            return null;
        return this.direction === "backward"
            ? this.current.end
            : this.current.start;
    }
    getFocus() {
        if (!this.current)
            return -1;
        return this.direction === "backward"
            ? this.current.start
            : this.current.end;
    }
    compact(focus) {
        const removals = [];
        const current = this.current;
        for (let r of this.ranges) {
            if (!this.current || r === this.current)
                continue;
            if (this.current.overlaps(r)) {
                this.current.combine(r);
                removals.push(r);
            }
        }
        removals.forEach((r) => this.removeRange(r));
        if (current)
            this.currentIndex = this.ranges.indexOf(current);
        if (!this.current)
            return;
        if (this.current.start < focus)
            this.direction = "forward";
        else if (this.current.end > focus)
            this.direction = "backward";
        else
            this.direction = "none";
    }
}
