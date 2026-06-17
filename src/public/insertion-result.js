/**
 * An instance of this class reports whether insert operation was successful.
 * if a node was added, or an existing one replaced then an iterator is provided. Otherwise the value of iterator is undefined
 */
class InsertionResult {
  /**
   * Default constructor
   * @param {boolean} wasAdded - the field is set to true when a new value was added to a container
   * @param {boolean} wasReplaced - the field is set to true when a new value replaced an existing value in the container
   * @param {Iterator} iterator - only provided if the node was added, or replaced
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
  InsertionResult: InsertionResult,
};
