// compare object titles alphabetically (case insensitive)
const compareByTitle = (itemA, itemB) => {
  let titleA = itemA.title.toLowerCase();
  let titleB = itemB.title.toLowerCase();

  if (titleA < titleB) {
    return -1;
  } else if (titleA > titleB) {
    return 1;
  } else {
    return 0;
  }
};

// return the list of shopping lists sorted by completion status and title.
const sortShoppingLists = lists => {
  let undone = lists.filter(shoppingList => !shoppingList.isDone());
  let done = lists.filter(shoppingList => shoppingList.isDone());
  undone.sort(compareByTitle);
  done.sort(compareByTitle);
  return [].concat(undone, done);
};

// return the list of items in the shopping list sorted by completion status and title
const sortItems = shoppingList => {
  let undone = shoppingList.items.filter(item => !item.isDone());
  let done = shoppingList.items.filter(item => item.isDone());
  undone.sort(compareByTitle);
  done.sort(compareByTitle);
  return [].concat(undone, done);
}

module.exports = {sortItems, sortShoppingLists};
