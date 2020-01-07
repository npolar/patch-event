import { deepCopy } from "./deep-copy.js";
import { apply as _mutatingApplyPatch, MissingError } from "./rfc6902/patch.js";
import { isDestructive } from "./rfc6902/diff.js";

const { fromEntries } = Object;
const { stringify, parse } = JSON;
const _jsonDeepCopy = o => parse(stringify(o));
const _realPath = path =>
  path && path.length && path.length > 1 && path.startsWith("/");
const _copier = fromEntries ? deepCopy : _jsonDeepCopy;

export const ops = ["add", "remove", "replace", "move", "copy", "test"];

// Apply a single non-mutating patch operation on a deep copy of the provided object
export const patch = (
  object,
  { op, path, value, from, ...extra },
  {
    copier = _copier,
    isAcceptablePath = _realPath,
    isValidOp = (op, arr = ops) => arr.includes(op)
  } = {}
) => {
  extra;
  //console.log({ extra });
  if (!op) {
    throw new MissingError("/op");
  }
  if (!path) {
    throw new MissingError("/path");
  }
  if (["move", "copy"].includes(op)) {
    if (!from) {
      throw new MissingError("/from");
    }
  }
  if (!isValidOp(op)) {
    throw `Invalid patch operation: "${op}"`;
  }
  // The condition below is to protect the innocent, as "" and "/" are valid paths ([json-pointer](http://jsonpatch.com/#json-pointer))s:
  // "To point to the root of the document use an empty string for the pointer.
  // The pointer / doesn’t point to the root, it points to a key of "" on the root (which is totally valid in JSON).""
  if (isDestructive(op) && !isAcceptablePath(path)) {
    throw "Path not acceptable for destructive operation";
  }

  const copy = copier(object);
  const error = _mutatingApplyPatch(copy, { op, path, value, from });
  if (error) {
    throw error;
  }
  return copy;
};
