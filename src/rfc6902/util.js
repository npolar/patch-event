const hasOwnProperty = Object.prototype.hasOwnProperty;
function clone(source) {
    if (source == null || typeof source != 'object') {
        return source;
    }
    if (source.constructor == Array) {
        const length = source.length;
        const arrayTarget = new Array(length);
        for (let i = 0; i < length; i++) {
            arrayTarget[i] = clone(source[i]);
        }
        return arrayTarget;
    }
    const objectTarget = {};
    for (const key in source) {
        if (hasOwnProperty.call(source, key)) {
            objectTarget[key] = clone(source[key]);
        }
    }
    return objectTarget;
}

export { clone };
