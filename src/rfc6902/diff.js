import { compare, objectType } from './equal.js';

const hasOwnProperty = Object.prototype.hasOwnProperty;
function isDestructive({ op }) {
    return op === 'remove' || op === 'replace' || op === 'copy' || op === 'move';
}
function subtract(minuend, subtrahend) {
    const obj = {};
    for (const add_key in minuend) {
        if (hasOwnProperty.call(minuend, add_key) && minuend[add_key] !== undefined) {
            obj[add_key] = 1;
        }
    }
    for (const del_key in subtrahend) {
        if (hasOwnProperty.call(subtrahend, del_key) && subtrahend[del_key] !== undefined) {
            delete obj[del_key];
        }
    }
    return Object.keys(obj);
}
function intersection(objects) {
    const length = objects.length;
    const counter = {};
    for (let i = 0; i < length; i++) {
        const object = objects[i];
        for (const key in object) {
            if (hasOwnProperty.call(object, key) && object[key] !== undefined) {
                counter[key] = (counter[key] || 0) + 1;
            }
        }
    }
    for (const key in counter) {
        if (counter[key] < length) {
            delete counter[key];
        }
    }
    return Object.keys(counter);
}
function isArrayAdd(array_operation) {
    return array_operation.op === 'add';
}
function isArrayRemove(array_operation) {
    return array_operation.op === 'remove';
}
function appendArrayOperation(base, operation) {
    return {
        operations: base.operations.concat(operation),
        cost: base.cost + 1,
    };
}
function diffArrays(input, output, ptr, diff = diffAny) {
    const memo = {
        '0,0': { operations: [], cost: 0 },
    };
    function dist(i, j) {
        const memo_key = `${i},${j}`;
        let memoized = memo[memo_key];
        if (memoized === undefined) {
            if (i > 0 && j > 0 && compare(input[i - 1], output[j - 1])) {
                memoized = dist(i - 1, j - 1);
            }
            else {
                const alternatives = [];
                if (i > 0) {
                    const remove_base = dist(i - 1, j);
                    const remove_operation = {
                        op: 'remove',
                        index: i - 1,
                    };
                    alternatives.push(appendArrayOperation(remove_base, remove_operation));
                }
                if (j > 0) {
                    const add_base = dist(i, j - 1);
                    const add_operation = {
                        op: 'add',
                        index: i - 1,
                        value: output[j - 1],
                    };
                    alternatives.push(appendArrayOperation(add_base, add_operation));
                }
                if (i > 0 && j > 0) {
                    const replace_base = dist(i - 1, j - 1);
                    const replace_operation = {
                        op: 'replace',
                        index: i - 1,
                        original: input[i - 1],
                        value: output[j - 1],
                    };
                    alternatives.push(appendArrayOperation(replace_base, replace_operation));
                }
                const best = alternatives.sort((a, b) => a.cost - b.cost)[0];
                memoized = best;
            }
            memo[memo_key] = memoized;
        }
        return memoized;
    }
    const input_length = (isNaN(input.length) || input.length <= 0) ? 0 : input.length;
    const output_length = (isNaN(output.length) || output.length <= 0) ? 0 : output.length;
    const array_operations = dist(input_length, output_length).operations;
    const [padded_operations] = array_operations.reduce(([operations, padding], array_operation) => {
        if (isArrayAdd(array_operation)) {
            const padded_index = array_operation.index + 1 + padding;
            const index_token = padded_index < (input_length + padding) ? String(padded_index) : '-';
            const operation = {
                op: array_operation.op,
                path: ptr.add(index_token).toString(),
                value: array_operation.value,
            };
            return [operations.concat(operation), padding + 1];
        }
        else if (isArrayRemove(array_operation)) {
            const operation = {
                op: array_operation.op,
                path: ptr.add(String(array_operation.index + padding)).toString(),
            };
            return [operations.concat(operation), padding - 1];
        }
        else {
            const replace_ptr = ptr.add(String(array_operation.index + padding));
            const replace_operations = diff(array_operation.original, array_operation.value, replace_ptr);
            return [operations.concat(...replace_operations), padding];
        }
    }, [[], 0]);
    return padded_operations;
}
function diffObjects(input, output, ptr, diff = diffAny) {
    const operations = [];
    subtract(input, output).forEach(key => {
        operations.push({ op: 'remove', path: ptr.add(key).toString() });
    });
    subtract(output, input).forEach(key => {
        operations.push({ op: 'add', path: ptr.add(key).toString(), value: output[key] });
    });
    intersection([input, output]).forEach(key => {
        operations.push(...diff(input[key], output[key], ptr.add(key)));
    });
    return operations;
}
function diffValues(input, output, ptr) {
    if (!compare(input, output)) {
        return [{ op: 'replace', path: ptr.toString(), value: output }];
    }
    return [];
}
function diffAny(input, output, ptr, diff = diffAny) {
    const input_type = objectType(input);
    const output_type = objectType(output);
    if (input_type == 'array' && output_type == 'array') {
        return diffArrays(input, output, ptr, diff);
    }
    if (input_type == 'object' && output_type == 'object') {
        return diffObjects(input, output, ptr, diff);
    }
    return diffValues(input, output, ptr);
}

export { diffAny, diffArrays, diffObjects, diffValues, intersection, isDestructive, subtract };
