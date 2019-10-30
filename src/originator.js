export const originator = event => {
  if (true !== event.composed) {
    throw "Cannot extract originator from non-composed event";
  }
  const [from] = event.composedPath();
  return from;
};
