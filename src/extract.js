const keepValueButNullifyEmptyString = (
  value,
  type,
  { nullable = true } = {}
) => {
  if (nullable && value === "") {
    return null;
  }
  return value;
};

export const extractOp = from => {
  let { op } = from.dataset;
  if (!op) {
    return "replace";
  }
  return op;
};

export const extractPath = from => {
  let { path } = from.dataset;
  if (!path) {
    return from.name;
  }
  return path;
};

export const extractValue = (from, type, { nullable = true } = {}) => {
  if (["number", "range"].includes(from.type)) {
    return from.valueAsNumber;
  }
  if (from.type === "checkbox") {
    return from.checked;
  } else if (from.type === "select-multiple") {
    return [...from.selectedOptions].map(o =>
      keepValueButNullifyEmptyString(o.value, type, { nullable })
    );
  } else {
    // Notice: The extracted value is the *property* value (not the html attribute)
    return keepValueButNullifyEmptyString(from.value, type, { nullable });
  }
};
