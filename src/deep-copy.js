const { entries, fromEntries } = Object;
const { isArray } = Array;
const { stringify, parse } = JSON;

// Thanks: https://2ality.com/2019/10/shared-mutable-state.html#deep-copying-in-javascript
// See also {clone} from "rfc6902/util.js"
export const deepCopy = original => {
  // fromEntries requires Chrome >= v73 (12 Mar 2019)
  if (fromEntries === undefined) {
    return parse(stringify(original));
  }

  if (isArray(original)) {
    return original.map(elem => deepCopy(elem));
  } else if (typeof original === "object" && original !== null) {
    return fromEntries(entries(original).map(([k, v]) => [k, deepCopy(v)]));
  } else {
    return original; // primitive values are atomic, no need to copy
  }
};
