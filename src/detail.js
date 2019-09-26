import { originator } from "./originator.js";
import { extractOp, extractPath, extractValue } from "./extract.js";

export const detail = event => {
  const from = originator(event);

  const op = extractOp(from);
  const type = from.type; // HTML [input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) (text, number, email, password, ...)
  const validity = from.validity; //  HTML [validity state(https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)
  const nullable = !from.hasAttribute("not-null"); // ie. nullable is default
  const path = extractPath(from); // JSON Pointer
  const value = extractValue(from, type, { nullable });

  let { valid } = validity;
  if (false === valid && null === value && nullable) {
    valid = true;
  }
  return {
    op,
    path,
    value,
    type,
    valid,
    nullable
  };
};
