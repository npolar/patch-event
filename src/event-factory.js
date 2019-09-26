export const eventFactory = (
  eventType,
  operation, // a single JSON Patch operation
  { bubbles = true, composed = true, cancelable = true } = {}
) =>
  new CustomEvent(eventType, {
    detail: operation,
    bubbles,
    composed,
    cancelable
  });
