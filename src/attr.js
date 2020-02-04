export const getSelfOrAncestorAttribute = (node, name) => {
  while (node !== null && node.parentElement) {
    if (node.hasAttribute(name)) {
      return node.getAttribute(name);
    }
    node = node.parentElement;
  }
};

export const hasSelfOrAncestorAttribute = (host, name) => {
  return undefined !== getSelfOrAncestorAttribute(host, name);
};
