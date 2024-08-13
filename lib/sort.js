// return the list of shopping lists sorted by completion status and title.
const sortShoppingLists = lists => {
  return lists.slice().sort((listA, listB) => {
    
    if (!listA.isDone() && listB.isDone()) {
      return -1;
    } else if (listA.isDone() && !listB.isDone()) {
      return 1;
    } else {
      if (listA.title < listB.title) {
        return -1;
      } else if (listA.title > listB.title) {
        return 1;
      } else {
        return 0;
      }
    }
  });
};

module.exports = sortShoppingLists;
