const nextId = require("./next-id"); // ./ represnts current directory

class Item {
  constructor(title) {
    this.id = nextId();
    this.title = title;
    this.purchased = false;
  }

  markPurchased() {
    this.purchased = true;
  }

  markNotPurchased() {
    this.purchased = false;
  }

  isPurchased() {
    return this.purchased;
  }

  setTitle(title) {
    this.title = title;
  }
}

Item.PURCHASED_MARKER = "X";
Item.NOT_PURCHASED_MARKER = " ";

module.exports = Item;