const nextId = require("./next-id");
const Item = require("./item");

class ShoppingList {
  constructor(title) {
    this.id = nextId();
    this.title = title;
    this.items = [];
  }

  add(item) {
    if (!(item instanceof Item)) {
      throw new TypeError("can only add Item objects");
    }

    this.items.push(item);
  }

  size() {
    return this.items.length;
  }

  first() {
    return this.items[0];
  }

  last() {
    return this.items[item.size() - 1];
  }

  itemAt(index) {
    this._validateIndex(index);
    return this.items[index];
  }

  markPurchasedAt(index) {
    this.itemAt(index).markPurchased();
  }

  markNotPurchasedAt(index) {
    this.itemAt(index).markNotPurchased();
  }

  isDone() {
    return this.size() > 0 && this.items.every(item => item.isPurchased());
  }

  shift() {
    return this.items.shift();
  }

  pop() {
    return this.items.pop();
  }

  removeAt(index) {
    this._validateIndex(index);
    return this.items.splice(index, 1);
  }

  toString() {
    let title = `---- ${this.title} ----`;
    let list = this.items.map(item => item.toString()).join("\n");
    return `${title}\n${list}`;
  }

  // custom method
  forEach(callback) {
    this.items.forEach(item => callback(item));
  }

  // custom method
  filter(callback) {
    let newList = new ShoppingList(this.title); // Create a new ShoppingList instance with the same title
    this.forEach(item => { // Iterate over each item in this.items
      if (callback(item)) { // Apply the callback function to each item
        newList.add(item); // If the callback returns true, add the item to the new list
      }
    });
    return newList; // Return the new filtered ShoppingList
  }

  // this involves three nested layers of callback -> careful of infinite loop
  findByTitle(title) {
    return this.filter(item => item.title === title).first();
  }

  findById(id) {
    return this.filter(item => item.id === id).first();
  }

  findIndexOf(itemToFind) {
    // findIndex() returns the index of the first element in an array that satifies
    // the provided testing function. 
    return this.items.findIndex(item => item.id === itemToFind.id); 
  }

  // return new shopping list whose this.items refers to an array of purchased items
  allPurchased() {
    return this.filter(item => item.isPurchased()); // isPurchased is a custom method
  }

  // returns a new shopping list whose this.items refers to an array of not purchased items
  notPurchased() {
    return this.filter(item => !item.isPurchased()); 
  }

  // _ indicates that parameter is present but not used.
  allItems() {
    return this.filter(_ => true);
  }

  markPurchased(title) {
    let item = this.findByTitle(title);
    if (item !== undefined) {
      item.markPurchased(); // markPurchased is supposed to be the method on the individual item
    }
  }

  markAllPurchased() {
    this.forEach(item => item.markPurchased());
  }

  toArray() {
    return this.items.slice();
  }

  setTitle(title) {
    this.title = title;
  }

  _validateIndex(index) { // _ indicates a "private" method, unenforced
    if (!(index in this.items)) {
      throw new ReferenceError(`invalid index: ${index}`);
    }
  }
}

module.exports = ShoppingList;