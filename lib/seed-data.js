const ShoppingList = require("./shopping-list");
const Item = require("./item");

let shoppingList1 = new ShoppingList("Work Items");
shoppingList1.add(new Item("Coffee"));
shoppingList1.add(new Item("Pens"));
shoppingList1.add(new Item("Ipad"));
shoppingList1.markPurchased("White boards");
shoppingList1.markPurchased("Notebooks");

let shoppingList2 = new ShoppingList("Home Items");
shoppingList2.add(new Item("Cups"));
shoppingList2.add(new Item("Almond Milk"));
shoppingList2.add(new Item("Desk"));
shoppingList2.add(new Item("Chair"));
shoppingList2.markPurchased("Piano");
shoppingList2.markPurchased("Speaker");
shoppingList2.markPurchased("Games");
shoppingList2.markPurchased("Watermelon");

let shoppingList3 = new ShoppingList("Additional Items");

let shoppingLists = [
  shoppingList1,
  shoppingList2,
  shoppingList3,
];

module.exports = shoppingLists;