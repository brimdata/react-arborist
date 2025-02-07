# Terms

This is the list of the common domain models found in react-arborist.

- **Tree View**: The main component that renders the UI.
- **Source Data**: Any data you bring from the outside world.
- **Node Object**: An interface that the TreeManager and TreeController expects
- **Source Data Proxy**: A wrapper around SourceData conforming to the NodeObject with methods to mutating SourceData.
- **Tree Manager:** Responsible for responding to change events from the TreeView
- **Tree Controller**: The programming API for developers to interact with the tree.
- **Node Controller**: The programming API for developers to interact with the node.
- **Partial Controller**: An object with the properties `value` and `onChange`, used for managing a slice of the component's state.

## Details

When you reach for react-arborist you usually will bring with you some _source data_ that you with to render with the _TreeView_ component.

The _TreeView_ component receives many props, one of which is called "nodes". The "nodes" prop is a _partial controller_ object with `value` and `onChange` properties. The nodes partial controller value must be an array of _node objects_.

A _node object_ is anything with the following interface:

```ts
type NodeObject<T> = {
  id: string;
  data: T;
  parent: NodeObject<T> | null;
  children: NodeObject<T>[] | null;
  isLeaf: boolean;
  level: number;
};
```

You can convert the _source data_ into _node objects_ yourself, or you can use a helper function provided by react-arborist called `createTreeManager(sourceData, options)`. It will return a _TreeManager_ instance. The _tree manager_ will have a property called "nodes" which will return an array of objects that conform to the _node object_ interface. However, they will be instances of the _SourceDataProxy_ class. These objects have all the properties required of _node objects_ along with methods to mutate the _source data_ it contains. The _TreeManager_ also has methods for mutating the _source data_ in response to change events.

### Internals

Now let's see the internals of the _TreeView_ component. All props are given to the _TreeController_ class. The UI components will inquire this _tree controller_ for the data and state they need to render UI.

During a render, the _tree controller_ will flatten the _node objects_ into an array of _node controllers_. This array can be accessed with the `.nodes` property.

To create a _NodeController_ instance, you will need the parent _tree controller_, the relevant _node object_ and the _row index_ where it will be rendered in UI. That class provides a bunch of convince methods for developers to use when rendering the UI.
