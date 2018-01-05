class KeyOnlyPolicy {
    fetch(n) {
        return n.key;
    }

    copy(to, from) {
        to.key = from.key;
    }
}

class KeyValuePolicy {
    fetch(n) {
        return [n.key, n.value];
    }

    copy(to, from) {
        to.key = from.key;
        to.value = from.value;
    }
}

module.exports = {
    KeyOnlyPolicy: KeyOnlyPolicy,
    KeyValuePolicy: KeyValuePolicy
};