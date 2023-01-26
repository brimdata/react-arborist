# Version 3.0.0

## Features

- Disable Edit
- Disable Drop Dynamically

### Disable Edit

The `disableEdit` prop was added to the tree to specify nodes that cannot be edited. This also fixed a bug when pressing the keyboard shortcut "Enter" on a node that did not render a form. The tree would get stuck in the "editing" mode and could not return to the normal mode.

### Disable Drop Dynamically

The `disableDrop` prop now accepts a function with two arguments. The first is the node being hovered over, the second are the nodes that are being dragged. This allows a node to be droppable for some nodes, but not others. Previously you could only provide a static list of nodes that were not droppable.

## Breaking Changes

### Tree Component `disableDrop` Prop

If you were passing a function to the `disableDrop` prop, you'll need to update it to use the following signature:

```ts
declare function disableDrop(args: {
  parentNode: NodeApi;
  dragNodes: NodeApi[];
  index: number;
}): boolean;
```

This lets you disallow a drop based on the items being dragged and which node you are hovering over. You may notice it matches the function signature of the onMove handler. It is still possible to pass a string or a boolean to the `disableDrop` prop to prevent drops statically.

### NodeApi `isDroppable` property

The `.isDroppable` property has been removed from the NodeApi class. This is now determined dynamically from the tree's state. It doesn't make sense to ask an single node if it is droppable anymore.
