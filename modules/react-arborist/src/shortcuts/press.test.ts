import { Press } from "./press.js";

const cases = [
  {
    event: {
      key: "ArrowDown",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    },
    string: "ArrowDown",
  },
  {
    event: {
      key: "A",
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: true,
    },
    string: "Shift+A",
  },
  {
    event: {
      key: "F",
      altKey: true,
      ctrlKey: true,
      metaKey: true,
      shiftKey: true,
    },
    string: "Control+Alt+Shift+Meta+F",
  },
];

for (const testCase of cases) {
  test("press to string", () => {
    const press = new Press(testCase.event);
    expect(press.toString()).toEqual(testCase.string);
    expect(press.isEqual(testCase.string));
  });
}
