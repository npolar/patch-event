import { TYPE } from "./type.js";
import { eventFactory } from "./event-factory.js";
export const patchEventFactory = detail => eventFactory(TYPE, detail);
