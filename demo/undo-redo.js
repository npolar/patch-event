import { register } from "../src/host.js";
import { patch } from "../src/patch.js";
const { stringify } = JSON;
const { log } = console;
const { freeze } = Object;

const handlePatchEvent = event => {
  console.log("patch", event.detail);
  const { op, path, value } = event.detail;
  set({ op, path, value });
  updateUI();
};

const _freezer = [{ foo: "bar" }];
let cursor = 0;

const get = () => _freezer[cursor];

const set = ({ op, path, value }, prev = get()) => {
  const next = patch(get(), { op, path, value });
  _freezer[++cursor] = freeze(next);
};

const size = () => _freezer.length;

const _undo = e => {
  e.preventDefault();
  cursor = cursor > 1 ? --cursor : 0;
  updateUI();
};

const _redo = e => {
  e.preventDefault();
  cursor = cursor < size() - 1 ? ++cursor : size() - 1;
  updateUI();
};

const form = document.querySelector("form");
register(form, handlePatchEvent, { eventTypes: ["input"] });

const undo = document.querySelector("#undo");
undo.addEventListener("click", _undo);

const redo = document.querySelector("#redo");
redo.addEventListener("click", _redo);

const updateUI = (state = get()) => {
  const output = document.querySelector("output");
  const foo = document.querySelector("input[data-path='/foo']");
  const bar = document.querySelector("input[data-path='/bar']");

  output.textContent = stringify(state);
  foo.value = state.foo || "";
  bar.value = state.bar || "";
};

updateUI();
