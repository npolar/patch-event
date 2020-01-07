import { originator } from "./originator.js";
import {
  extractOp,
  extractPath,
  extractValue,
  extractFrom
} from "./extract.js";
import { hasSelfOrAncestorAttribute } from "./host.js";

export const operation = event => {
  const host = originator(event);
  const op = extractOp(host);
  const { type, validity } = host;
  // type: HTML [input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) (text, number, email, password, ...)
  // validity:  HTML [validity state(https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)
  const notnull = hasSelfOrAncestorAttribute(host, "not-null"); // ie. nullable is default
  const nullable = !notnull;

  const path = extractPath(host); // path is a JSON Pointer
  const value = extractValue(host, { type, nullable }); // type is html host's type
  const from = extractFrom(host);
  let valid = validity && "valid" in validity ? validity.valid : null;
  if (false === valid && null === value && nullable) {
    valid = true;
  }

  const operation = {
    op,
    path,
    value,
    from,
    extra: {
      type,
      valid,
      nullable
    }
  };
  return operation;
};
