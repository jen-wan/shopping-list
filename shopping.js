const express = require("express"); // Load the `express` module.
const morgan = require("morgan"); // Load the `morgan` module.
const flash = require("express-flash");
const session = require("express-session");
const store = require("connect-loki");
const { req, body, validationResult } = require("express-validator"); 
const ShoppingList = require("./lib/shopping-list");
const Item = require("./lib/item");
const { sortItems, sortShoppingLists } = require("./lib/sort"); // import module for sorting shopping lists.

const app = express(); // Create the Express application object `app`. 
const LokiStore = store(session);
const host = "localhost"; // define host to which app listens for HTTP connections.
const port = 3002; // define the port to which the app listens for HTTP connctions.

app.set("views", "./views"); // tell Express where to find view templates
app.set("view engine", "pug"); // Tell express to use Pug as the view engine.

app.use(morgan("common")); // Enable logging with Morgan.
app.use(express.static('public')); // tells Express to find static assets in the public directory
app.use(express.urlencoded({ extended: false })); // tell Express about the format used by the form data.

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in milliseconds
    path: "/",
    secure: false,
  },
  name: "launch-school-shopping-app-session-id",
  secret: "this is not very secure",
  store: new LokiStore({}),
  resave: false,
  saveUninitialized: true,
}));

app.use(flash());

// Set up persistent session data
app.use((req, res, next) => {
  let shoppingLists = [];

  if ("shoppingLists" in req.session) {
    req.session.shoppingLists.forEach(shoppingList => {
      shoppingLists.push(ShoppingList.makeShoppingList(shoppingList));
    });
  }

  req.session.shoppingLists = shoppingLists;
  next();
});

// Extract session info
// res.locals allows us to pass data (like flash messages) to the view for the current request
app.use((req, res, next) => {
  res.locals.flash = req.session.flash; 
  delete req.session.flash;
  next();
});

// Find a shopping list with the indicated ID. Returns `undefined` if not found.
// Note that the `shoppingListId` must be numeric.
const loadShoppingList = (shoppingListId, req) => {
  return req.session.shoppingLists.find(list => list.id === shoppingListId);
}

// Find the specific item in the shopping List. Returns `undefined` if not found.
// Note that the `itemId` must be numeric.
const loadItem = (itemId, shoppingListId, req) => {
  let shoppingList = loadShoppingList(shoppingListId, req);
  if (shoppingList) {
    return shoppingList.findById(itemId);
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
    shoppingLists: sortShoppingLists(req.session.shoppingLists),
  });
});
// Render new shopping list page
app.get("/lists/new", (req, res) => {
  res.render("new-list");
});

// render the specific shopping list 
app.get("/lists/:shoppingListId", (req, res, next) => {
  let listId = +req.params.shoppingListId; // type conversion be careful!
  let shoppingList = loadShoppingList(+listId, req);
  if (shoppingList === undefined) {
    next(new Error(`Not found.`));
  } else {
    res.render("list", {
      shoppingList,
      items: sortItems(shoppingList),
    });
  }
});

app.get("/lists/:shoppingListId/edit", (req, res, next) => {
  let {shoppingListId} = {...req.params};
  let shoppingList = loadShoppingList(+shoppingListId, req);
  if(!shoppingList) {
    next(new Error("Not found."));
  } else {
    res.render("edit-list", {
      shoppingList: shoppingList,
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
    .custom((title, {req }) => { // custom validator
      let duplicate = req.session.shoppingLists.find(list => list.title === title);
      return duplicate === undefined;
    })
    .withMessage("List title must be unique."), // err msg if error found in custom validator
  ],
  (req, res) => { // error handler for validation errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(message => req.flash("error", message.msg));
      console.log(req.session.shoppingLists);
      res.render("new-list", {
        flash: req.flash(),
        shoppingListTitle: req.body.shoppingListTitle,
      });
    } else {
      req.session.shoppingLists.push(new ShoppingList(req.body.shoppingListTitle));
      req.flash("success", "The shopping list has been created.");
      res.redirect("/lists");
    }
  }
);

// Toggle item completion status
app.post("/lists/:shoppingListId/items/:itemId/toggle", (req, res, next) => {
  let {shoppingListId, itemId } = {...req.params}; // obj destructuring & spread syntax
  let item = loadItem(+itemId, +shoppingListId, req); // type conversion be careful!
  
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

// delete an item from a shopping list
app.post("/lists/:shoppingListId/shopping/:itemId/destroy", (req, res, next) => {
  let { shoppingListId, itemId } = { ...req.params };
  let shoppingList = loadShoppingList(+shoppingListId, req);
  if (!shoppingList) {
    next(new Error("Not found."));
  } else {
    let item = shoppingList.findById(+itemId); // make sure to do type conversion here!
    if (!item) {
      next(new Error("Not found."));
    } else {
      let index = shoppingList.findIndexOf(item);
      shoppingList.removeAt(index);
      req.flash("success", "The item has been deleted.");
      res.redirect(`/lists/${shoppingListId}`); // make sure the route URL is correct!! Need the / in front of lists.
    }
  }
});

// complete all of the items in a shopping list.
app.post("/lists/:shoppingListId/complete_all", (req, res, next) => {
  let {shoppingListId} = {...req.params};
  let shoppingList = loadShoppingList(+shoppingListId, req); // again remember to convert string to number.
  if (!shoppingList) {
    next(new Error("Not found."));
  } else {
    shoppingList.markAllPurchased();
    req.flash("success", "List all done!");
    res.redirect(`/lists/${shoppingListId}`);
  }
});

// Add a new item to the shopping list.
app.post("/lists/:shoppingListId/shopping", 
  // validation chains
  [
    body("itemTitle")
      .trim()
      .isLength({ min: 1})
      .withMessage("The item title is required.")
      .bail()
      .isLength({ max: 100})
      .withMessage("Title must be between 1 and 100 characters.")
  ],

  // main route handler
  (req, res, next) => {
    let { shoppingListId } = { ...req.params };
    let shoppingList = loadShoppingList(+shoppingListId, req);

    if (!shoppingList) {
      next(new Error("Not found."));
    } else {
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash("error", error.msg));
        res.render("list", {
          flash: req.flash(), // not sure why we need this line.
          shoppingList: shoppingList,
          items: sortItems(shoppingList),
          itemTitle: req.body.itemTitle,
        });
      } else {
        let item = new Item(req.body.itemTitle);
        shoppingList.add(item);
        req.flash("success", "A new item was created.")
        res.redirect(`/lists/${shoppingListId}`);
      }
    }
  }
);

// delete List button
app.post("/lists/:shoppingListId/destroy", (req, res, next) => {
  let shoppingListId = req.params.shoppingListId;
  let shoppingList = loadShoppingList(+shoppingListId, req);
  let shoppingLists = req.session.shoppingLists;
  
  if(!shoppingList) {
    next(new Error("Not found."));
  } else {
    let index = shoppingLists.indexOf(shoppingList);
    shoppingLists.splice(index, 1);

    req.flash("success", "Shopping list has been deleted.");
    res.redirect("/lists");
  }
});

// create a new list title 
app.post("/lists/:shoppingListId/edit", 
  [
    body("shoppingListTitle")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Title is required.")
      .bail()
      .isLength({ max: 100 })
      .withMessage("Title must be between 1 and 100 characters.")
      .custom((title, { req }) => {
        let duplicate = req.session.shoppingLists.find(list => list.title == title);
        return duplicate === undefined;
      })
      .withMessage("Shopping list title must be unique."),
  ],
  
  (req, res, next) => {
    let shoppingListId = req.params.shoppingListId;
    let shoppingList = loadShoppingList(+shoppingListId, req);
    if (!shoppingList) {
      next(new Error("Not found."));
    } else {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash("error", error.msg));

        res.render("edit-list", {
          flash: req.flash(), 
          shoppingList, 
          shoppingListTitle: req.body.shoppingListTitle
        });
      } else {
        shoppingList.setTitle(req.body.shoppingListTitle);
        req.flash("success", "Title name was changed.");
        res.redirect(`/lists/${shoppingListId}`);
      }
    }
  }
);

// 404 Not Found error handler
app.use((err, req, res, _next) => { // _next uses underscore to avoid warning about unused variables.
  console.log(err);
  res.status(404).send(err.message);
})

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