const ShoppingList = require("./shopping-list");
const Item = require("./item");

let shoppingList1 = new ShoppingList("Work Items");
shoppingList1.add(new Item("Coffee"));
shoppingList1.add(new Item("Pens"));
shoppingList1.add(new Item("Ipad"));
shoppingList1.markPurchased("Coffee");
shoppingList1.markPurchased("Pens");

let shoppingList2 = new ShoppingList("Home Items");
shoppingList2.add(new Item("Cups"));
shoppingList2.add(new Item("Almond Milk"));
shoppingList2.add(new Item("Desk"));
shoppingList2.add(new Item("Chair"));
shoppingList2.markPurchased("Cups");
shoppingList2.markPurchased("Almond Milk");
shoppingList2.markPurchased("Desk");
shoppingList2.markPurchased("Chair");

let shoppingList3 = new ShoppingList("Additional Items");

let shoppingList4 = new ShoppingList("birthday party items");
shoppingList4.add(new Todo("party hat"));


let shoppingLists = [
  shoppingList1,
  shoppingList2,
  shoppingList3,
  shoppingList4,
];

module.exports = shoppingLists;