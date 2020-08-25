import { patchEventFactory } from "./patch-event-factory.js";

export const emit = (host, operation) =>
  host.dispatchEvent(patchEventFactory(operation));
