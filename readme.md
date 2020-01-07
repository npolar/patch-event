# @npolar/patch-event

Non-destructive data modification via (JSON) [Patch](https://tools.ietf.org/html/rfc6902) events.
[![Build status](https://nppolar.semaphoreci.com/badges/patch-event.svg)](https://nppolar.semaphoreci.com/patch-event)

## Use

**Register**
Use `register` to have a host element re-emit regular `input` events as `patch` events.

```js
import { register } from "@npolar/patch-event/src/host.js";

const host = document.querySelector("form");
const handler = event => console.log(event.detail);
register(host, handler);
```

```html
<form>
  <input path="/foo" />
  <input path="/bar" />
</form>
```

The code above will log a JSON Patch operation for every native `input` event, example payload:

```json
{ "op": "replace", "path": "/foo", "value": "bar" }
```

**eventTypes**
Specify which events that should be re-sent as `patch` events using `eventTypes`:

```js
register(host, handler, { eventTypes: ["change"] });
```

## Features

- Modern: Codebase is ECMAScript2019
- Functional: employs a set of pure functions
- Safe: Patches are performed on a deep copy of the original
- Tiny (2Kb gzipped)

## Scenarios

Created with the following usage scenarios in mind:

- Form editing with modification history and undo/redo functionality ([demo](https://patch-event.npolar.now.sh/demo/undo-redo.html))
- Parameter transformation, ie. convert user input into the shape needed by your application's internals

## Install

```sh
yarn add https://github.com/npolar/patch-event#v0.0.1
```

## Requirements

A ES2019 compliant browser; eg. Firefox >= 63, Chrome >= 73, Edge >= 7x

# Credits

This library builds a non-destructive patch function over chbrown's JSON Pointer and JSON Patch implementation ([rfc6902](https://github.com/chbrown/rfc6902)), using Dr. Alex's [deepCopy](https://2ality.com/2019/10/shared-mutable-state.html).
