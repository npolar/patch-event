export const getSelfOrAncestorAttribute = (host, name) => {
  let node = host;
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
