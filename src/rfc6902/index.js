import './equal.js';
import { diffAny, isDestructive } from './diff.js';
import { Pointer } from './pointer.js';
import './util.js';
import { apply } from './patch.js';

function applyPatch(object, patch) {
    return patch.map(operation => apply(object, operation));
}
function wrapVoidableDiff(diff) {
    function wrappedDiff(input, output, ptr) {
        const custom_patch = diff(input, output, ptr);
        return Array.isArray(custom_patch) ? custom_patch : diffAny(input, output, ptr, wrappedDiff);
    }
    return wrappedDiff;
}
function createPatch(input, output, diff) {
    const ptr = new Pointer();
    return (diff ? wrapVoidableDiff(diff) : diffAny)(input, output, ptr);
}
function createTest(input, path) {
    const endpoint = Pointer.fromJSON(path).evaluate(input);
    if (endpoint !== undefined) {
        return { op: 'test', path, value: endpoint.value };
    }
}
function createTests(input, patch) {
    const tests = new Array();
    patch.filter(isDestructive).forEach(operation => {
        const pathTest = createTest(input, operation.path);
        if (pathTest)
            tests.push(pathTest);
        if ('from' in operation) {
            const fromTest = createTest(input, operation.from);
            if (fromTest)
                tests.push(fromTest);
        }
    });
    return tests;
}

export { applyPatch, createPatch, createTests };
