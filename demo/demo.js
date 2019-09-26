import { patchEvent } from "../src/patch-event.js";
import { register } from "../src/host.js";
import { patch } from "../src/patch.js";

const { stringify } = JSON;
const { warn } = console;

const handleFooPatchEvent = event => {
  const { op, path, value } = event.detail;
  model = patch(model, { op, path, value });
  console.log({ op, path, value });

  outputModel.textContent = stringify(model);
  outputEvents.textContent += "\n" + stringify({ op, path, value });
};

const emitPatchEvent = ({ op, path, value }) => {
  form.dispatchEvent(patchEvent({ op, path, value }));
};

const handleAddRemoveClick = event => {
  let { op, path } = event.target.dataset;
  let { value } = event.target;
  emitPatchEvent({ op, path, value });

  const reverse = op === "add" ? "remove" : "add";
  button.textContent = `${reverse === "add" ? "+" : "-"} ${reverse} ${path}`;
  event.target.dataset.op = reverse;
};

let model = {
  foo: {
    text: null,
    number: null,
    checkbox: null,
    radio: null,
    color: null,
    select: null
  },
  range: null,
  date: null,
  time: null
};

const form = document.querySelector("form");
form.addEventListener("submit", event => event.preventDefault());
const outputModel = document.querySelector("#object-output");
const outputEvents = document.querySelector("#events-output");
const button = document.querySelector("button");

button.onclick = handleAddRemoveClick;
outputModel.textContent = stringify(model);

register(form, handleFooPatchEvent, { wait: 0 });
