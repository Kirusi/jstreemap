/**
 * An instance of this class reports whether insert operation was successful.
 * if a node was added, or an existing one replaced then an iterator is provided. Otherwise the value of iterator is undefined
 */
class InsertionResult {
    /**
     * Default constructor
     * @param {Boolean} wasAdded 
     * @param {Boolean} wasReplaced 
     * @param {Iterator} iterator only provided if the node was added, or replaced
     */
    constructor(wasAdded, wasReplaced, iterator) {
        /**
         * Boolean flag indicating whether an element was added
         */
        this.wasAdded = wasAdded;
        /**
         * Boolean flag indicating whether an existing node was updated
         */
        this.wasReplaced = wasReplaced;
        /**
         * {Iterator} instance pointing to the newly added node
         */
        this.iterator = iterator;
    }
}

module.exports = {
    InsertionResult: InsertionResult
};