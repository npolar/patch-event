import { PATCH_OP } from "./type.js";
import { eventFactory } from "./event-factory.js";
export const patchEvent = detail => eventFactory(PATCH_OP, detail);
