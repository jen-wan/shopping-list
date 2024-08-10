// This module is used to generate a unique ID number for todo list and todo objects.
let currentId = 0;

let nextId = () => { // this is a closure by the way. :)
  currentId += 1;
  return currentId;
};

module.exports = nextId;