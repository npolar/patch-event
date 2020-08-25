import { compare } from './equal.js';
import { Pointer } from './pointer.js';
import { clone } from './util.js';

class MissingError extends Error {
    constructor(path) {
        super(`Value required at path: ${path}`);
        this.path = path;
        this.name = 'MissingError';
    }
}
class TestError extends Error {
    constructor(actual, expected) {
        super(`Test failed: ${actual} != ${expected}`);
        this.actual = actual;
        this.expected = expected;
        this.name = 'TestError';
        this.actual = actual;
        this.expected = expected;
    }
}
function _add(object, key, value) {
    if (Array.isArray(object)) {
        if (key == '-') {
            object.push(value);
        }
        else {
            const index = parseInt(key, 10);
            object.splice(index, 0, value);
        }
    }
    else {
        object[key] = value;
    }
}
function _remove(object, key) {
    if (Array.isArray(object)) {
        const index = parseInt(key, 10);
        object.splice(index, 1);
    }
    else {
        delete object[key];
    }
}
function add(object, operation) {
    const endpoint = Pointer.fromJSON(operation.path).evaluate(object);
    if (endpoint.parent === undefined) {
        return new MissingError(operation.path);
    }
    _add(endpoint.parent, endpoint.key, clone(operation.value));
    return null;
}
function remove(object, operation) {
    const endpoint = Pointer.fromJSON(operation.path).evaluate(object);
    if (endpoint.value === undefined) {
        return new MissingError(operation.path);
    }
    _remove(endpoint.parent, endpoint.key);
    return null;
}
function replace(object, operation) {
    const endpoint = Pointer.fromJSON(operation.path).evaluate(object);
    if (endpoint.parent === null) {
        return new MissingError(operation.path);
    }
    if (Array.isArray(endpoint.parent)) {
        if (parseInt(endpoint.key, 10) >= endpoint.parent.length) {
            return new MissingError(operation.path);
        }
    }
    else if (endpoint.value === undefined) {
        return new MissingError(operation.path);
    }
    endpoint.parent[endpoint.key] = operation.value;
    return null;
}
function move(object, operation) {
    const from_endpoint = Pointer.fromJSON(operation.from).evaluate(object);
    if (from_endpoint.value === undefined) {
        return new MissingError(operation.from);
    }
    const endpoint = Pointer.fromJSON(operation.path).evaluate(object);
    if (endpoint.parent === undefined) {
        return new MissingError(operation.path);
    }
    _remove(from_endpoint.parent, from_endpoint.key);
    _add(endpoint.parent, endpoint.key, from_endpoint.value);
    return null;
}
function copy(object, operation) {
    const from_endpoint = Pointer.fromJSON(operation.from).evaluate(object);
    if (from_endpoint.value === undefined) {
        return new MissingError(operation.from);
    }
    const endpoint = Pointer.fromJSON(operation.path).evaluate(object);
    if (endpoint.parent === undefined) {
        return new MissingError(operation.path);
    }
    _add(endpoint.parent, endpoint.key, clone(from_endpoint.value));
    return null;
}
function test(object, operation) {
    const endpoint = Pointer.fromJSON(operation.path).evaluate(object);
    const result = compare(endpoint.value, operation.value);
    if (!result) {
        return new TestError(endpoint.value, operation.value);
    }
    return null;
}
class InvalidOperationError extends Error {
    constructor(operation) {
        super(`Invalid operation: ${operation.op}`);
        this.operation = operation;
        this.name = 'InvalidOperationError';
    }
}
function apply(object, operation) {
    switch (operation.op) {
        case 'add': return add(object, operation);
        case 'remove': return remove(object, operation);
        case 'replace': return replace(object, operation);
        case 'move': return move(object, operation);
        case 'copy': return copy(object, operation);
        case 'test': return test(object, operation);
    }
    return new InvalidOperationError(operation);
}

export { InvalidOperationError, MissingError, TestError, add, apply, copy, move, remove, replace, test };
