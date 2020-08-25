import { emit as emitPatchEvent } from "./emit.js";
export const handleAddFactory = ({ path, value, op = "add" }) => event => {
  event.preventDefault();
  emitPatchEvent(event.target, { op, path, value });
};

export const handleRemoveFactory = ({ path, op = "remove" }) => event => {
  event.preventDefault();
  emitPatchEvent(event.target, { op, path });
};
