export const originator = event => {
  let host;
  if (event.composed) {
    [host] = event.composedPath();
  } else {
    [host] = event.path;
  }
  if (!host) {
    throw "Failed extracting originator";
  }
  return host;
};
