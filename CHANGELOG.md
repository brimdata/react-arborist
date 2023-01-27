# Version 3.0.0

## Features

- Disable Edit
- Disable Drop Dynamically

### Disable Edit

The `disableEdit` prop was added to the tree to specify nodes that cannot be edited. This also fixed a bug when pressing the keyboard shortcut "Enter" on a node that did not render a form. The tree would get stuck in the "editing" mode and could not return to the normal mode.

### Disable Drop Dynamically

The `disableDrop` prop now accepts a function with the arguments described below. Previously you could only provide a static list of nodes that were not droppable, but now you can determine it dynamically.

## Breaking Changes

### Tree Component `disableDrop` Prop

If you were passing a function to the `disableDrop` prop, you'll need to update it to use the following signature:

```ts
declare function disableDrop(args: {
  dragNodes: NodeApi[]; // The nodes being dragged
  parentNode: NodeApi; // The new parent of the dragNodes if dropped
  index: number; // The new child index of the dragNodes if dropped
}): boolean;
```

This lets you disallow a drop based on the items being dragged and which node you are hovering over. You might notice it matches the function signature of the onMove handler. It is still possible to pass a string or a boolean to the `disableDrop` prop to prevent drops statically.

### NodeApi `isDroppable` property

The `.isDroppable` property has been removed from the NodeApi class. This is now determined dynamically from the tree's state. It doesn't make sense to ask an single node if it is droppable anymore.
