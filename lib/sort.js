// return the list of shopping lists sorted by completion status and title.

// this is the sorting function to list todo titles alphabetically
const compareByTitle = (shoppingListA, shoppingListB) => {
  let titleA = shoppingListA.title;
  let titleB = shoppingListB.title;

  if (titleA < titleB) {
    return -1;
  } else if (titleA > titleB) {
    return 1;
  } else {
    return 0;
  }
};

// return the list of todo lists sorted by completion status and title.
const sortShoppingLists = lists => {
  let undone = lists.filter(shoppingList => !shoppingList.isDone());
  let done = lists.filter(shoppingList => shoppingList.isDone());
  undone.sort(compareByTitle);
  done.sort(compareByTitle);
  return [].concat(undone, done);
};

module.exports = sortShoppingLists;
