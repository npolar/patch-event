const { entries, fromEntries } = Object;
const { isArray } = Array;

// Thanks: https://2ality.com/2019/10/shared-mutable-state.html#deep-copying-in-javascript
export const deepCopy = original => {
  if (isArray(original)) {
    return original.map(elem => deepCopy(elem));
  } else if (typeof original === "object" && original !== null) {
    return fromEntries(entries(original).map(([k, v]) => [k, deepCopy(v)]));
  } else {
    return original; // primitive values are atomic, no need to copy
  }
};
