const hasOwnProperty = Object.prototype.hasOwnProperty;
function objectType(object) {
    if (object === undefined) {
        return 'undefined';
    }
    if (object === null) {
        return 'null';
    }
    if (Array.isArray(object)) {
        return 'array';
    }
    return typeof object;
}
function compareArrays(left, right) {
    const length = left.length;
    if (length !== right.length) {
        return false;
    }
    for (let i = 0; i < length; i++) {
        if (!compare(left[i], right[i])) {
            return false;
        }
    }
    return true;
}
function compareObjects(left, right) {
    const left_keys = Object.keys(left);
    const right_keys = Object.keys(right);
    const length = left_keys.length;
    if (length !== right_keys.length) {
        return false;
    }
    for (let i = 0; i < length; i++) {
        const key = left_keys[i];
        if (!hasOwnProperty.call(right, key) || !compare(left[key], right[key])) {
            return false;
        }
    }
    return true;
}
function compare(left, right) {
    if (left === right) {
        return true;
    }
    const left_type = objectType(left);
    const right_type = objectType(right);
    if (left_type == 'array' && right_type == 'array') {
        return compareArrays(left, right);
    }
    if (left_type == 'object' && right_type == 'object') {
        return compareObjects(left, right);
    }
    return false;
}

export { compare, objectType };
