import { register } from "../src/host.js";
import { patch } from "../src/patch.js";
const { stringify } = JSON;

const handlePatchEvent = event => {
  console.log("patch-op", event.detail);
  const { op, path, value } = event.detail;
  data = patch(data, { op, path, value });
  output.textContent = stringify(data);
};

let data = { foo: null };
const form = document.querySelector("form");
const output = document.querySelector("output");
output.textContent = stringify(data);

register(form, handlePatchEvent);
