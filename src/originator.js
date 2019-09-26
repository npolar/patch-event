export const originator = event => {
  const originatorTree = event.composedPath();

  if (!originatorTree || originatorTree.length < 1) {
    throw "No originator";
  }
  return originatorTree[0];
};
