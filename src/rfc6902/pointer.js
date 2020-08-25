function unescape(token) {
    return token.replace(/~1/g, '/').replace(/~0/g, '~');
}
function escape(token) {
    return token.replace(/~/g, '~0').replace(/\//g, '~1');
}
class Pointer {
    constructor(tokens = ['']) {
        this.tokens = tokens;
    }
    static fromJSON(path) {
        const tokens = path.split('/').map(unescape);
        if (tokens[0] !== '')
            throw new Error(`Invalid JSON Pointer: ${path}`);
        return new Pointer(tokens);
    }
    toString() {
        return this.tokens.map(escape).join('/');
    }
    evaluate(object) {
        let parent = null;
        let key = '';
        let value = object;
        for (let i = 1, l = this.tokens.length; i < l; i++) {
            parent = value;
            key = this.tokens[i];
            value = (parent || {})[key];
        }
        return { parent, key, value };
    }
    get(object) {
        return this.evaluate(object).value;
    }
    set(object, value) {
        let cursor = object;
        for (let i = 1, l = this.tokens.length - 1, token = this.tokens[i]; i < l; i++) {
            cursor = (cursor || {})[token];
        }
        if (cursor) {
            cursor[this.tokens[this.tokens.length - 1]] = value;
        }
    }
    push(token) {
        this.tokens.push(token);
    }
    add(token) {
        const tokens = this.tokens.concat(String(token));
        return new Pointer(tokens);
    }
}

export { Pointer };
