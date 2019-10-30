import { deepCopy } from "./deep-copy.js";
import { apply as _mutatingApplyPatch } from "./rfc6902/patch.js";

const { fromEntries } = Object;
const { stringify, parse } = JSON;
const _jsonDeepCopy = o => parse(stringify(o));

// Apply a single non-mutating patch operation
export const patch = (object, operation) => {
  const copy = fromEntries ? deepCopy(object) : _jsonDeepCopy(object);
  const { op, path, value } = operation;
  _mutatingApplyPatch(copy, { op, path, value });
  return copy;
};
