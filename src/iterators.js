'use strict';

class BaseIterator {
    constructor(node, container) {
        this.__n = node;
        this.__c = container;
    }

    equals(rhs) {
        let lhsClass = this.constructor.name;
        let rhsClass = rhs.constructor.name;
        if (lhsClass !== rhsClass) {
            throw new Error(`Can't compare an instance of ${lhsClass} with an instance of ${rhsClass}`);
        }
        if (this.__c !== rhs.__c) {
            throw new Error('Iterators belong to different containers');
        }
        return this.__n === rhs.__n;
    }

    get node() {
        return this.__n;
    }

    get container() {
        return this.__c;
    }
}

class Iterator extends BaseIterator {
    constructor(...args) {
        if (args.length === 2) {
            let [node, container] = args;
            super(node, container);
        }
        else if (args.length === 1) {
            let [obj] = args;
            let className = obj.constructor.name;
            if (className === Iterator.name) {
                super(obj.__n, obj.__c);
            }
            // eslint-disable-next-line no-use-before-define
            else if (className === ReverseIterator.name) {
                let c = obj.__c;
                super(c.next(obj.__n), c);
            }
            else {
                throw new Error(`Can't create an Iterator from ${className}`);
            }
        }
        else {
            throw new Error('Can\'t create an Iterator with provided parameters');
        }
    }

    next() {
        this.__n = this.__c.next(this.__n);
    }

    prev() {
        this.__n = this.__c.prev(this.__n);
    }
}

class ReverseIterator extends BaseIterator {
    constructor(...args) {
        if (args.length === 2) {
            let [node, container] = args;
            super(node, container);
        }
        else if (args.length === 1) {
            let [obj] = args;
            let className = obj.constructor.name;
            if (className === ReverseIterator.name) {
                super(obj.__n, obj.__c);
            }
            else if (className === Iterator.name) {
                let c = obj.__c;
                super(c.prev(obj.__n), c);
            }
            else {
                throw new Error(`Can't create an ReverseIterator from ${className}`);
            }
        }
        else {
            throw new Error('Can\'t create a Reverse Iterator with provided parameters');
        }
    }

    next() {
        this.__n = this.__c.prev(this.__n);
    }

    prev() {
        this.__n = this.__c.next(this.__n);
    }
}

module.exports = {
    Iterator: Iterator,
    ReverseIterator: ReverseIterator
};