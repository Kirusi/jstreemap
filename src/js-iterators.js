'use strict';

class JsIterator {
    constructor(container) {
        this.container = container;
        this.node = container.jsBegin();
    }

    next() {
        let res = {};
        res.done = (this.node === this.container.jsEnd());
        if (!res.done) {
            res.value = this.container.valuePolicy.fetch(this.node);
            this.node = this.container.next(this.node);
        }
        return res;
    }
}

class JsReverseIterator {
    constructor(container) {
        this.container = container;
        this.node = container.jsRbegin();
    }

    next() {
        let res = {};
        res.done = (this.node === this.container.jsRend());
        if (!res.done) {
            res.value = this.container.valuePolicy.fetch(this.node);
            this.node = this.container.prev(this.node);
        }
        return res;
    }
}

module.exports = {
    JsIterator: JsIterator,
    JsReverseIterator: JsReverseIterator
};