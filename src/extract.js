import { getSelfOrAncestorAttribute } from "./host.js";
// Ancestor attributes are needed when using custom elements that wraps vanilla html inputs/selects:
// the originator element that dispatches won't have "op", "path", and "from" attributes

const _valueOrNull = (value, type, { nullable = true } = {}) => {
  if (nullable && value === "") {
    return null;
  }
  return value;
};

const _extractAttr = (host, name, { fallback } = {}) => {
  let attr = getSelfOrAncestorAttribute(host, name);
  if (!attr) {
    attr = getSelfOrAncestorAttribute(host, `data-${name}`);
  }
  if (!attr && fallback) {
    attr = fallback;
  }
  return attr;
};

// Extract copy/move "from" (or "data-from") attribute on self or ancestor
export const extractFrom = host => {
  return _extractAttr(host, "from");
};

// Extract op(eration) from "op" or "data-op" attribute on self or ancestor
export const extractOp = (host, { fallback = "replace" } = {}) => {
  return _extractAttr(host, "op", { fallback });
};

// Extract path or data-path attribute on self or ancestor
export const extractPath = host => {
  const path = _extractAttr(host, "path");
  // Fallback: "name" attribute
  // If no [data-]path: Use regular name attribute, used eg. by input and select
  if (!path && host.name && host.name.length > 1 && host.name.startsWith("/")) {
    return host.name;
  }
  return path;
};

export const extractValue = (
  host,
  { type = host.type, nullable = true } = {}
) => {
  if (["number", "range"].includes(host.type)) {
    return host.valueAsNumber;
  } else if (["checkbox"].includes(host.type)) {
    return host.checked;
  } else if (["radio"].includes(host.type)) {
    return host.value;
  } else if (host.type === "select-multiple") {
    return [...host.selectedOptions].map(o =>
      _valueOrNull(o.value, type, { nullable })
    );
  } else {
    // Notice: The extracted value here is the *property* value (may differ from the html attribute)
    return _valueOrNull(host.value, type, { nullable });
  }
};
