# React Arborist

A full-featured tree component for React. 

The tree is a ubiquitous UI component in software applications. There are already many libraries that provide this componet for React apps, but none were full-featured enough to stand on their own.

This libraries provides all the common features expected in a tree viewer. You can select one or many nodes to drag and drop into new positions, open and close folders, render an inline form for renaming, efficiently show thousands of items with virtualization, and provide your own node renderer to control the style.

![Demo](https://user-images.githubusercontent.com/3460638/131920177-c47c34e5-d3e3-4826-937d-b366f527cdfe.gif)

## Installation

```
yarn add react-arborist
```

```
npm install react-arborist
```

## Example

Render the tree data structure.

```js
const data = {
  id: "The Root",
  children: [{id: "Node A"}, {id: "Node B"}]
}

function App() {
  return (
    <Tree data={data}>
      {Node}
    </Tree>
  );
}

function Node({ ref, styles, data, tree}) {
  return (
    <div ref={ref} style={styles.row}>
      <div style={styles.indent}>
        {data.name}
      </div>
    </div>
  )
}
```
## Expected Data Structure

The Tree component expects the data prop to be a tree like data stucture with the following type.

```ts
type Data = {
  id: string, /* Required */
  children?: Data[]
  isOpen?: boolean
}
```

If your data does not look like this, you can provide a `childrenAccessor` prop which can be a string or a function. You can also provide an `isOpenAccessor`.

```ts
<Tree childrenAccessor="items" ... 
// Or 
<Tree childrenAccessor={(node) => node.items} ... 
```

## Tree Component

Unlike some other Tree Components, react-arborist is designed as a [controlled component](https://reactjs.org/docs/forms.html#controlled-components). This means that the consumer will provide the tree data and the handlers to change said data. The only state managed interally is for drag and drop, selection, and editing.

| Prop | Default | Description |
| --- | --- | --- |
| data  | (required) | The tree data structure to render as described above. |
| width | 300 | The width of the tree.
| height | 500 | The height of the tree. To dynamically fill it's container, use a [hook](https://github.com/ZeeCoder/use-resize-observer) or [component](https://github.com/bvaughn/react-virtualized-auto-sizer) to gather the width and height of the Tree's parent.
| rowHeight | 24 | The height of each row.
| indent | 24 | The number of pixels to indent child nodes.
| hideRoot | false | Hide the root node so that the first set of children appear as the roots.
| onOpen | noop | Handler called when a node is open. This and the subsequent functions should update the `data` prop for the tree to re-render.
| onClose | noop | Handler called when a node is closed.
| onMove | noop | Handler called when a user moves one or more nodes by dragging and dropping.
| onEdit | noop | Handler called when a user performs an inline edit of the node.
| childrenAccessor | "children" | Used to get a node's children if they exist on a property other than "children".
| isOpenAccessor | "isOpen" | Used to get a node's openness state if it exists on a property other than "isOpen".
| openByDefault | true | Choose if the node should be open or closed when it has an undefined openness state.
| className | undefined | Adds a class to the containing div.

The only child of the Tree Component must be a NodeRenderer function as described below.

```jsx
const NodeRenderer = ({data, ref, styles, tree}) => ...

const MyApp = () => 
  <Tree>
    {NodeRenderer}
  </Tree>
```

## Node Renderer Component

The most basic node renderer will look like this:

```jsx
function NodeRenderer({data, ref, styles, handlers}) {
  return (
    <div ref={ref} style={styles.row}>
      <div style={styles.indent}>{data.id}</div>
    </div>
  )
}
```

The function is passed the data this individual node, the DOM ref used for drag and drop, the styles to position the row in the virtualized list and the styles to indent the current node according to it's level in the tree.

| Prop | Type | Description |
| ---- | ---- | ----------- |
| data | Node | A single node from the tree data structure provided. | 
| ref  | Ref | Must be attched to the root element returned by the NodeRenderer. This is needed for drag and drop to work.
| **styles** | Object | This is an object that contains styles for the position of the row, and the level of indentation. Each key is described below.
| styles.row | CSSProperties | Since the tree only renderes the rows that are currently visible, all the rows are absolutely positioned with a fixed top and left. Those styles are in this property.
| styles.indent | CSSProperties | This is simply a left padding set to the level of the tree multiplied by the tree indent prop.
| **state** | object | An handful of boolean values that indicate the current state of this node. See below for details.
| state.isOpen | boolean | True if this node has children and the children are visible. Use this to display some type a open or closed icon.
| state.isSelected | boolean | True if this node is selected. Use this to show a "selected" state. Maybe a different background?
| state.isHoveringOverChild | boolean | True if the user is dragging an node, and the node is hovering over one of this node's direct children. This can be used to indicate which folder the user is dragging an item into.
| state.isDragging | boolean | True if this node is being dragged.
| state.isFistOfSelected | boolean | True if this is the first of a contiguous group of selected rows. This can be used to tastfully style a group of selected items. Maybe a different border radius on the first and last rows?
| state.isLastOfSelected | boolean | True if this is the last of a contiguous group of selected rows.
| state.isEditing | boolean | True if this row is being edited. When true, the renderer should return some type of form input.
| **handlers** | object | A collection of handlers to attach to the DOM, that provide selectable and toggleable behaviors. Each handler is described below.
| handlers.select | MouseEventHandler | Attach this to the element that tiggers selection. Maybe you want to add it to the outermost div. <br /> `<div onClick={handlers.select}>`
| handlers.toggle | MouseEventHandler | Attach this to the element that opens and closes the node. Maybe you want to add it to the `+`/`-` icon. <br />`<icon onClick={handlers.toggle}>`
| handlers.edit | `() => void` | Makes this node editable. This will re-render the Node with the `state.isEditing` prop set to `true`.
| handlers.submit | `(update: string) => void` | Sends the update to the `onEdit` handler in the Tree component, and sets the `state.isEditing` prop to `false`.
| handlers.reset | `() => void` | Re-renders with the `state.isEditing` prop set to `false`.
