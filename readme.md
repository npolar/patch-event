# @npolar/patch-event

ES2019 browser library that sends user input events as (JSON) [Patch operations](https://tools.ietf.org/html/rfc6902) (add, copy, move, remove, replace).

## Usage
The following example is equivalent to the [mini](demo/mini.html) demo.

```html
<form>
  <input data-path="/foo" />
</form>
```

```js
import { register } from "@npolar/patch-event/src/host.js";
import { patch } from "@npolar/patch-event/src/patch.js";

let data = { foo: null };

const handlePatchEvent = event => {
  const operation = event.detail; // A patch operation with { op, path, value } keys
  const patched = patch(data, operation);
  data = { ...data, patched };
  // data is patched: do whatever you need to do...
};

register(document.querySelector("form"), handlePatchEvent);
```

When typing "bar" the `form` will send 4 `patch-op` events, the last has payload:
```
{"op":"replace","path":"/foo","value":"bar","type":"text","valid":true,"nullable":true}
```
