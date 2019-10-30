import { register } from "../src/host.js";
import { patch } from "../src/patch.js";
const { stringify } = JSON;
const { log } = console;

const handlePatchEvent = event => {
  console.log("patch", event.detail);
  const { op, path, value } = event.detail;
  set({ op, path, value });
  update();
};

const _states = [{ foo: "bar" }];
const _patches = [];
let cursor = 0;

const get = () => _states[cursor];

const set = ({ op, path, value }, prev = get()) => {
  const next = patch(get(), { op, path, value });
  _states[++cursor] = next;
};

const _undo = e => {
  e.preventDefault();
  cursor = cursor > 1 ? --cursor : 0;
  update();
};

const _redo = e => {
  e.preventDefault();
  cursor = cursor < _states.length - 1 ? ++cursor : _states.length - 1;
  update();
};

const form = document.querySelector("form");
register(form, handlePatchEvent);

const undo = document.querySelector("#undo");
undo.addEventListener("click", _undo);

const redo = document.querySelector("#redo");
redo.addEventListener("click", _redo);

const update = (state = get()) => {
  const output = document.querySelector("output");
  const foo = document.querySelector("#foo");
  const bar = document.querySelector("#bar");

  output.textContent = stringify(state);
  foo.value = state.foo || "";
  bar.value = state.bar || "";
};

update();
