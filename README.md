# React Arborist

*A full-featured tree component for React.*

![React Arborist Demo](http://g.recordit.co/XGrsubdORi.gif)

## Features

* sortable
* virtualized
* multi-selectable
* collapsible
* renameable
* style-less

## Example

Render the tree data structure.

```js
const data = {
  id: "The Root",
  children: [{id: "Node A"}, {id: "Node B"}]
}

function App() {
  return (
    <Tree
      data={data}
      width={300}
      height={500}
      indent={24}
    >
      {Node}
    </Tree>
  );
}

function Node({ node, props, indent, handlers }) {
  return (
    <div {...props}>
      <div style={{ paddingLeft: indent }}>{node.model.id}</div>
    </div>
  );
}
```

The `data` prop must be an object with an `id` property. Any child nodes must be put in the array property `children`.

## Open and Close

Add a boolean property `isOpen` to any of the nodes to display it open or closed. If no property exists, it will default to false.

```js
const data = {
  id: "The Root",
  isOpen: true,
  children: [...]
}
```

To toggle the isOpen field attach the `handlers.toggleOpen` callback to a event in your `Node` component, then add the `onOpen/onClose` handlers to the Tree component.

```jsx
function MyApp() {
  const onOpen = (id) => {
    // Change the data however you want...
    setData(mutate(id, (n) => n.isOpen = true))
  }

  return <Tree
    onOpen={onOpen}
    onClose={onClose}
    ...
}

function Node({ props, handlers }) {
  return (
    <div {...props} onClick={handlers.toggleOpen}>
    // ...
    </div>
  );
}
```

