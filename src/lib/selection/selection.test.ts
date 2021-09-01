import { Selection } from "./selection";

const createSelection = (...ranges: [number, number][]) => {
  return new Selection(ranges);
};

describe("select", () => {
  test("select one after end", () => {
    const s = createSelection([0, 0]);
    s.multiSelect(1);
    expect(s.getRanges()).toEqual([[0, 1]]);
    expect(s.direction).toEqual("forward");
  });

  test("select one before start", () => {
    const s = createSelection([1, 1]);
    s.multiSelect(0);
    expect(s.getRanges()).toEqual([[0, 1]]);
    expect(s.direction).toEqual("backward");
  });

  test("select between two ranges", () => {
    const s = createSelection([0, 0], [2, 2]);
    s.multiSelect(1);
    expect(s.getRanges()).toEqual([[0, 2]]);
    expect(s.direction).toEqual("forward");
  });

  test("select new spot", () => {
    const s = createSelection([0, 0]);
    s.multiSelect(5);
    expect(s.getRanges()).toEqual([
      [0, 0],
      [5, 5],
    ]);
    expect(s.direction).toEqual("none");
  });
});

describe("deselect", () => {
  test("one", () => {
    const s = createSelection([0, 0]);
    s.deselect(0);
    expect(s.getRanges()).toEqual([]);
  });

  test("start of a range", () => {
    const s = createSelection([0, 5]);
    s.deselect(0);
    expect(s.getRanges()).toEqual([[1, 5]]);
  });

  test("end of a range", () => {
    const s = createSelection([0, 5]);
    s.deselect(5);
    expect(s.getRanges()).toEqual([[0, 4]]);
  });

  test("between a range", () => {
    const s = createSelection([0, 5]);
    s.deselect(3);
    expect(s.getRanges()).toEqual([
      [0, 2],
      [4, 5],
    ]);
  });
});

describe("extend", () => {
  test("up", () => {
    const s = createSelection();
    s.multiSelect(5);
    s.extend(6);
    expect(s.getRanges()).toEqual([[5, 6]]);
  });

  test("down", () => {
    const s = createSelection();
    s.multiSelect(5);
    s.extend(4);
    expect(s.getRanges()).toEqual([[4, 5]]);
  });

  test("around anchor", () => {
    const s = createSelection([5, 10]);
    s.extend(1);
    expect(s.getRanges()).toEqual([[1, 5]]);
  });

  test("through other ranges", () => {
    const s = createSelection([0, 0], [5, 5], [9, 10]);
    s.multiSelect(2);
    s.extend(20);
    expect(s.getRanges()).toEqual([
      [0, 0],
      [2, 20],
    ]);
  });

  test("clicking backward", () => {
    const s = createSelection([15, 15]);
    s.extend(3);
    expect(s.getRanges()).toEqual([[3, 15]]);
  });

  test("split range then extend", () => {
    const s = createSelection([5, 10]);
    s.deselect(8);
    expect(s.currentIndex).toEqual(1);
  });
});
