import test from "node:test";
import assert from "node:assert";
import { evaluate } from "../lib/evaluate.js";

const variables = {
  isLeaf: true,
  isRoot: false,
  count: 10,
};

const inputs = [
  { script: "1 + 1", result: 2 },
  { script: "1 - 1", result: 0 },
  { script: "1 * 2", result: 2 },
  { script: "2 / 2", result: 1 },
  { script: "1 > 0", result: true },
  { script: "1 < 0", result: false },
  { script: "1 <= 1", result: true },
  { script: "1 >= 1", result: true },
  { script: "1 && 1", result: true },
  { script: "isLeaf", result: true },
  { script: "isRoot", result: false },
  { script: "isRoot || count > 0", result: true },
];

for (const input of inputs) {
  test(`eval "${input.script}"`, () => {
    assert.equal(evaluate(input.script, variables), input.result);
  });
}
