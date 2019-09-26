import {
  apply,
  InvalidOperationError,
  MissingError,
  TestError,
  add,
  copy,
  move,
  remove,
  replace,
  test
} from "./rfc6902/patch.js";

// Apply a single non-mutating patch operation on a object
export const patch = (object, operation) => {
  const result = { ...object };
  const { op, path, value } = operation;
  apply(result, { op, path, value });
  return result;
};

// // Apply multiple patch operations and return result, without mutating incoming object
// export const multipatch = (object, operations) => {
//   const result = { ...object };
//   for (const { op, path, value } of operations) {
//     result = apply(result, { op, path, value });
//   }
//   return result;
// };

export const mutating = {
  apply,
  add,
  copy,
  move,
  remove,
  replace
};

export { test,
InvalidOperationError,
MissingError,
TestError };
