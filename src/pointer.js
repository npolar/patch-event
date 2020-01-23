import { Pointer } from "./rfc6902/pointer.js";
export { Pointer };
export const get = (object, path) => Pointer.fromJSON(path).get(object);
export { get as value };
