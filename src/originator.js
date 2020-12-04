export const originator = event => {
  const [host] = event.composedPath();

  if (!host) {
    throw "Failed extracting originator";
  }
  return host;
};
