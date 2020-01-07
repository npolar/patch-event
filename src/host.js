import { TYPE } from "./type.js";
import { patchEventFactory } from "./patch-event-factory.js";
import { operation as operationFromEvent } from "./operation.js";

const _hostClassNameMap = new Map([
  ["HTMLButtonElement", ["click"]],
  ["HTMLFormElement", ["input", "click"]],
  ["HTMLInputElement", ["input"]]
]);
const _eventTypesFromHostType = (
  host,
  map = _hostClassNameMap,
  unknown = ["input"]
) => {
  const { name } = host.constructor;
  return map.has(name) ? map.get(name) : unknown;
};

const _patchEvent = Symbol("patch-event");

// Convenience method to add patch event redispatching to a host element
// Works by capturing regular HTML events and redispatch these as json-patch events
const addEventRedispatcher = (host, { eventType = "input", dispatcher } = {}) =>
  host.addEventListener(eventType, dispatcher);

// Convenience method to inject handler for json-patch events in a host (custom) element
const addPatchEventListener = (host, receiver) =>
  host.addEventListener(TYPE, receiver);

// Register handler (receiver) and re-dispatcher
export const register = (
  host,
  receiver,
  { eventTypes = _eventTypesFromHostType(host), dispatcher = redispatch } = {}
) => {
  const { registered } = host[_patchEvent] || {};
  if (!registered) {
    addPatchEventListener(host, receiver);
    host[_patchEvent] = { registered: true };
  }
  for (const eventType of eventTypes) {
    addEventRedispatcher(host, { eventType, dispatcher });
  }
};

export const emit = (host, operation) =>
  host.dispatchEvent(patchEventFactory(operation));

const redispatch = event => {
  const operation = operationFromEvent(event);
  const { path } = operation;
  const ignore =
    "click" === event.type && !["checkbox", "radio"].includes(event.target.type)
      ? true
      : false;

  if (path && ignore === false) {
    emit(event.target, operation);
  }
};

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
