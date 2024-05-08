<h1>React Arborist (with DND-multi-backend)</h1>

This is a fork of [react-arborist](https://github.com/brimdata/react-arborist) that adds support for multiple backends like HTML5 and Touch. It uses [react-dnd-multi-backend](https://github.com/LouisBrunner/dnd-multi-backend/) to provide support for [HTML5](https://github.com/react-dnd/react-dnd/tree/main/packages/backend-html5) and [Touch](https://github.com/react-dnd/react-dnd/blob/main/packages/backend-touch).
Hoping to get it work with [Accessible backends](https://github.com/discord/react-dnd-accessible-backend) for Keyboard support.

For most documentation and examples, please refer to the original react-arborist package. This fork is intended to be a drop-in replacement for the original package, with the added benefit of supporting multiple backends.

The react-arborist package is still in process to release [v4](https://github.com/brimdata/react-arborist/pull/235) which adds accessibility features, fixes bugs and improves overall user experience. I will try to keep this package up-to-date, but this package should be a temporary solution until the original package has the touch and accessibility features.


<h2>Installation</h2>
Execute below command to install the package, make sure you have .npmrc setup to use @naviance registry.

```bash
npm i @naviance/react-arborist
```
