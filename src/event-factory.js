const _detailEqualsOperation = operation => operation;
export const eventFactory = (
  eventType,
  operation, // a single JSON Patch operation
  {
    detail = _detailEqualsOperation,
    bubbles = true,
    composed = true,
    cancelable = false
  } = {}
) =>
  new CustomEvent(eventType, {
    detail: detail(operation),
    bubbles,
    composed,
    cancelable
  });
