import { PATCH_OP } from "./type.js";
import { patchEvent } from "./patch-event.js";
import { detail } from "./detail.js";

// Convenience method to add json-patch event redispatching to a host element
// Works by capturing regular HTML events and redispatch these as json-patch events
export const addEventRedispatcher = (
  host,
  { eventType = "input", dispatcher } = {}
) => host.addEventListener(eventType, dispatcher);

// Convenience method to inject handler for json-patch events in a host (custom) element
export const addPatchEventListener = (host, receiver) =>
  host.addEventListener(PATCH_OP, receiver);

// Register handler (receiver) and re-dispatcher
export const register = (
  host,
  receiver,
  { eventTypes = ["input", "click"], dispatcher = redispatch } = {}
) => {
  const { registered } = host._patchEvent || {};
  if (!registered) {
    addPatchEventListener(host, receiver);
    host._patchEvent = { registered: true };
  }
  for (const eventType of eventTypes) {
    addEventRedispatcher(host, { eventType, dispatcher });
  }
};

export const dispatch = (host, operation) =>
  host.dispatchEvent(patchEvent(operation));

export const redispatch = event => {
  const operation = detail(event);
  event.preventDefault();
  dispatch(event.target, operation);
};
