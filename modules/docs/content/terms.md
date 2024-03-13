React arborist allows you to pass in any random data, and it will create a tree.

A tree consisit of a root node.

We always have to wrap the data, but we do want to mutate the data.

We always wrap the data in a node struct. Then when a change happens, we use the arborist to mutate the data. Mutating the data will trigger a re-render, and all the data will be wrapped in the node structs again.

Pass your data to createTree.

createTree wraps your data in node structs using the accessors you provide. It will sort and filter as well if you specifiy.

It will also provide methods to mutate the data.

When the data is mutated, you will want to re-set the data.

Create tree will wrap everything in node structs. It will also have the accessors
