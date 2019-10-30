# @npolar/patch-event

Non-destructive data modification via (JSON) [Patch](https://tools.ietf.org/html/rfc6902) events.

## Features

- Modern: Codebase is ECMAScript2019
- Functional: employs a set of pure functions
- Safe: Patches are performed on a deep copy of the original
- Tiny (2Kb gzipped)

## Scenarios

Created with the following usage scenarios in mind:

- Form editing with modification history and undo/redo functionality ([demo](https://patch-event.npolar.now.sh/demo/undo-redo.html))
- Parameter transformation, ie. convert user input into the shape needed by your application's internals

## Use

**Register**
Use `register` to have a host element re-emit regular `input` events as `patch` events.

```js
import { register } from "@npolar/patch-event/src/host.js";
const host = document.querySelector("input[data-path='/foo']");
const handler = event => console.log(event.detail);
register(host, handler);
```

```html
<input data-path="/foo" />
```

The code above will log a JSON Patch operation for every input event, eg.:

```json
{ "op": "replace", "path": "/foo", "value": "bar" }
```

Notice: The built-in `input` event is fired as usual.

**eventTypes**
If you do not want events for evry keypress, change the `eventTypes` that are intercepted:

```js
register(host, handler, { eventTypes: ["change"] });
```

## Install

```sh
yarn add https://github.com/npolar/patch-event#master
cd node_modules/@npolar/patch-event && yarn && yarn prepare && cd -
```

## Requirements

A ES2019 browser; eg. Firefox >= 63, Chrome >= 73

# Credits

This library builds a non-destructive patch function over chbrown's JSON Pointer and JSON Patch implementation ([rfc6902](https://github.com/chbrown/rfc6902)), using Dr. Alex's [deepCopy](https://2ality.com/2019/10/shared-mutable-state.html). Thanks.
