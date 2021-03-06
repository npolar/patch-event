import { register } from "../src/host.js";
import { patch } from "../src/patch.js";
const { parse, stringify } = JSON;
const { log } = console;
const { freeze } = Object;

const _freezer = [{ foo: "bar" }];
let cursor = 0;

const handlePatchEvent = event => {
  console.log("patch", event.detail);
  const { op, path, value } = event.detail;
  set({ op, path, value });
  updateUI();
};

const get = (c = cursor) => _freezer[c];

const set = ({ op, path, value }, prev = get(cursor)) => {
  const next = patch(prev, { op, path, value });
  if (stringify(next) !== stringify(prev)) {
    _freezer[++cursor] = freeze(next);
  }
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
  const foo = document.querySelector("input[path='/foo']");
  const bar = document.querySelector("input[path='/bar']");
  const freezerSize = document.querySelector("#size");
  const position = document.querySelector("#cursor");
  const undo = document.querySelector("#undo");
  const redo = document.querySelector("#redo");
  const f = document.querySelector("#freezer");

  output.textContent = stringify(state);
  foo.value = state.foo || "";
  bar.value = state.bar || "";
  freezerSize.textContent = size();
  position.textContent = String(cursor);
  undo.disabled = cursor < 1 ? true : false;
  redo.disabled = size() - 1 === cursor ? true : false;
};

updateUI();
