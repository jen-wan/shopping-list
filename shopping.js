const express = require("express"); // Load the `express` module.
const morgan = require("morgan"); // Load the `morgan` module.
const flash = require("express-flash");
const session = require("express-session");
const { body, validationResult } = require("express-validator"); 
const ShoppingList = require("./lib/shopping-list");
const { sortItems, sortShoppingLists } = require("./lib/sort"); // import module for sorting shopping lists.

const app = express(); // Create the Express application object `app`. 
const host = "localhost"; // define host to which app listens for HTTP connections.
const port = 3002; // define the port to which the app listens for HTTP connctions.

// Static data for initial testing
let shoppingLists = require("./lib/seed-data");

app.set("views", "./views"); // tell Express where to find view templates
app.set("view engine", "pug"); // Tell express to use Pug as the view engine.

app.use(morgan("common")); // Enable logging with Morgan.
app.use(express.static('public')); // tells Express to find static assets in the public directory
app.use(express.urlencoded({ extended: false })); // tell Express about the format used by the form data.

app.use(session({
  name: "launch-school-shopping-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "this is not very secure",
}));

app.use(flash());

// Extract session info
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

// 404 Not Found error handler
app.use((err, req, res, _next) => { // _next uses underscore to avoid warning about unused variables.
  console.log(err);
  res.status(404).send(err.message);
})

// Find a shopping list with the indicated ID. Returns `undefined` if not found.
// Note that the `shoppingListId` must be numeric.
const loadShoppingList = (shoppingListId, shoppingLists) => {
  return shoppingLists.find(list => list.id === shoppingListId);
}

// Find the specific item in the shopping List. Returns `undefined` if not found.
// Note that the `itemId` must be numeric.
const loadItem = (itemId, shoppingListId) => {
  let shoppingList = loadShoppingList(shoppingListId, shoppingLists);
  if (shoppingList) {
    return shoppingList.items.find(item => item.id === itemId);
  } else {
    return undefined;
  }
}

// Render the list of shopping lists
app.get("/", (req, res) => { // primary route for this application
  res.redirect("/lists");
});

// Render the list of shopping lists
app.get("/lists", (req, res) => {
  res.render("lists", {
    shoppingLists: sortShoppingLists(shoppingLists),
  });
});

// Render new shopping list page
app.get("/lists/new", (req, res) => {
  res.render("new-list");
});

// render the specific shopping list 
app.get("/lists/:shoppingListId", (req, res, next) => {
  let listId = +req.params.shoppingListId; // type conversion be careful!
  let shoppingList = loadShoppingList(+listId, shoppingLists);
  if (shoppingList === undefined) {
    next(new Error(`Not found.`));
  } else {
    res.render("list", {
      shoppingList,
      items: sortItems(shoppingList),
    });
  }
});


// Create a new shopping list
app.post("/lists",
  // validation middleware placed in an array
  [
    body("shoppingListTitle") // validating the shoppingListTitle field of request body
    .trim()
    .isLength({ min: 1})
    .withMessage("The list title is required.") // withMessage defines an err msg when validation condition isn't met.
    .isLength({ max: 100 })
    .withMessage("List title must be betweeen 1 and 100 characters.")
    .custom(title => { // custom validator
      let duplicate = todoLists.find(list => list.title === title);
      return duplicate === undefined; 
    })
    .withMessage("List title must be unique."), // err msg if error found in custom validator
  ],
  (req, res) => { // error handler for validation errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(message => req.flash("error", message.msg));
      res.render("new-list", {
        flash: req.flash(),
        shoppingListTitle: req.body.shoppingListTitle,
      });
    } else {
      shoppingLists.push(new ShoppingList(req.body.shoppingListTitle));
      req.flash("success", "The shopping list has been created.");
      res.redirect("/lists");
    }
  }
);

// Toggle item completion status
app.post("/lists/:shoppingListId/items/:itemId/toggle", (req, res, next) => {
  let {shoppingListId, itemId } = {...req.params}; // obj destructuring & spread syntax
  let item = loadItem(+itemId, +shoppingListId); // type conversion be careful!
  
  if (!item) {
    next(new Error(`Not found.`));
  } else {
    if (item.isPurchased()) {
      item.markNotPurchased();
      req.flash("success", `${item.title} marked as NOT done!`);
    } else {
      item.markPurchased();
      req.flash("success", `${item.title} marked done.`);
    }

    res.redirect(`/lists/${shoppingListId}`);
  }
});

// Listener
app.listen(port, host, () => {
  console.log(`Shopping is listening on port ${port} of ${host}!`);
});

// test code
// shoppingLists.forEach(obj => {
//   let arrayOfItems = obj['items'];
//   arrayOfItems.forEach(item => {
//     console.log(`${item.title}: ${item.isPurchased()}`);
//   }) 
// });