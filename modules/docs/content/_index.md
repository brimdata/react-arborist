---
title: Home
---

<div class="switcher">

<div>
React Arborist is a library for rendering tree-like data structures. This is a common UI element in many desktop and web applications. The classic example is displaying files on a file system.

React Arborist follows the partially-controlled component pattern. This means that you can opt-in to state control the component as you need to. Otherwise, the state is controlled internally.

Let's get a tree setup.

Suppose we have data that looks like this.

</div>

<div>

```js
const data = {
  name: 'code',
  path: '/users/jk',
  files: [
    {
      name: 'react-arborist',
      path: '/users/jk/code',
      files: [
        {
          name: 'package.json',
          path: '/users/jk/code/react-arborist'
        },
        {
          name: '.prettierrc',
          path: '/users/jk/code/react-arborist'
        }
      ]
    }
  ]
};
```

</div>
</div>

<div class="switcher">

  <div>
It's important to note that tree data can come in many shapes and sizes. However, they do all follow a common pattern. The `Tree` component that react-arborist exports needs you to convert your data into an array Nodes.

There is a utility you can use to turn any data into nodes. It works like this.

  </div>
  <div>

```jsx
// #APPROVED
const [data, setData] = useState(myRandomData);
const nodes = createNodes(data, {
  id: (d) => d.path,
  name: (d) => d.name,
  children: (d) => d.files,
  isLeaf: (d) => !('files' in d),
  sort: (a, b) => a.name - b.name,
  isVisible: (node) => true // not sure about his yet
});

<Tree
  nodes={{
    value: nodes,
    onChange: (e) => setData(nodes.handleChange(e))
  }}
>
```

```jsx
// #APPROVED
const nodes = useNodes(myRandomData, {
  id: (d) => d.path,
  name: (d) => d.name,
  children: (d) => d.files,
  isLeaf: (d) => !('files' in d),
  sort: (a, b) => a.name - b.name,
  isVisible: (node) => true // not sure about his yet
});

<Tree nodes={nodes} />;
```

  </div>
</div>

<div class="switcher">
  <div>
You can then pass these nodes to the Tree Component.
  </div>

  <div>
  <div>

```jsx
<Tree
  nodes={{
    value: nodes,
    onChange: (newValue) => setNodes(newValue)
  }}
>
  {Node}
</Tree>
```

  </div>
</div>

<div class="switcher">
  <div>
Now let's say you want to persist the expanded and collapsed state of the tree. You will opt-in to control that peice of state by providing the expanded prop.
  </div>
  <div>

```jsx
// If you keep the open data within your tree data,
// you can extract it with the useOpens hook.

const [opens, setOpens] = useOpens(data, {
  id: (d) => d.path
  isOpen = (d) => d.isOpen
})

// Otherwise, you can provide your own object
// to keep track of it.
const [opens, setOpens] = useState({})

<Tree
  opens={{
    value: opens,
    onChange: (newValue) => setOpens(newValue)
  }}
/>
```

  </div>
</div>

Finally, you may also want to keep track and of the selection state, and be able to change the selection from outside the tree. A nice way to do that might be.

```jsx

const id = useSelector(Current.fileId)
const selection = useMultiSelection(id)

useEffect(() => {
  selection.only(id)
}, [id])

<Tree
  selection={{
    value: selection.value,
    onChange: selection.set
  }}
/>
```

Ok, now maybe you want to sync the tree state with an external data store, like your backend database. Use the the following callbacks to get that done.

```jsx
const nodes = useNodes(data)

<Tree
  onMove={(args) => api.move(args)}
  onEdit={(args) => api.edit(args)}
  onCreate={() => api.create(args)}
  onDelete={() => api.destroy(args)}
  onOpen={(args) => {
    nodes.addChild(id, {loading: true})
    api.fetchChildren(id)
  }}
  onSelect={}
  onFocus={}
  nodes={{
    value: nodes.value,
    onChange: nodes.set
  }}
  selection={{
    value: selection.value,
    onChange: selection.set
  }}
  opens={{
    value: opens.value,
    onChange: opens.set
  }}
  focus={{
    value: focus.value,
    onChange: focus.set
  }}
  dnd={{
    value: dnd.value,
    onChange: dnd.set
  }}
  treeState={{
    value: state.value,
    onChange: state.set
  }}
/>
```

## How would you handle changing the selection externally as well as internally.

Well let's think about this. How do we do this in smaller components. We have an input, whenever it changes we handle it in the callback then we change the state. The onChange handler does not fire if we set the state ourselves.

The same should work in our app. The onSelect callback should fire if it changes internally, but it should not if it is changed from the outside.

```jsx
const [value, setValue] = useState('hello world');

return <input value={value} onChange={(e) => setValue(e.target.value)} />;
```

```jsx
const selection = useMultiSelection();

return (
  <Tree
    selection={{
      value: selection.value,
      onChange: (e) => {
        // Now we will include all the relevant information
        // to perform side effects in here.
        // This will run if changed internally,
        // This will not run if changed externally
        selection.set(e.target.value);
      }
    }}
  />
);
```

That works. Love that.

## Handle Node Manipulation

```jsx
const nodes = useNodes(/* */);

return (
  <Tree
    nodes={{
      value: nodes.value,
      onChange: (e) => {
        // e.type === "new" | "create" | "update" | "delete" | "move"
        // e.payload = {
          id: //string
          isLeaf://
          parentId: // id,
          index://n

        }
        nodes.set(e.value);
      }
    }}
  />
);
```

Yup, that's going to work great.

## Tree filtering can now happen in the useNodes hook.

```jsx
const nodes = useNodes({
  searchTerm: '',
  searchMatch: leafs | leavesAndInternal | custom
});
```

## Changing the selection externally

```jsx
const chatId = useCurrentChatId();
const selection = useSelection();

useEffect(() => {
  selection.selectOne(chatId, {scroll: 'center'});
}, [chatId]);

return (
  <Tree
    selection={{
      value: selection.value
    }}
  />
);
```

## Select All

```jsx
const tree = useTree(data, {
  nodes: {
    id: (d) => d.path,
    children: (d) => d.items,
    searchTerm: 'hi',
    searchFilter: leavesOnly
  },
  selection: {
    id: (data) => select(Current.getPath)
  },
  opens: {
    id: (d) => d.path,
    isOpen: (d) => d.isOpen
  },
  keybindings: (defaults) => {
    return {
      ...defaults(),
      "cmd+a": () => tree.thisThat()
      "up": () => tree.focus.up()
    }
  }
});

return (
  <Tree
    {...tree}
    renderers={{
      node: () => {}
      row: () => {}
      cursor: () => {}

    }}
  />
);
```


## Filtering

I need to decide where to do the filtering on the dones. Some things to consider are this. When the tree is filtered, we probably want have different open state. For example, if everything is closed and we type a search, we want all the folders to suddenly be open. But if they clear out their search, it would be good to leave all the folders closed again.

So the tree needs to know if it is filtered or not. So the filtering should happen in the tree.

this.rows = ConstructNodes
