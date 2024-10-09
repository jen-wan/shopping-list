const express = require("express"); // Load the `express` module.
const morgan = require("morgan"); // Load the `morgan` module.
const flash = require("express-flash");
const session = require("express-session");
const { body, validationResult } = require("express-validator"); 
const ShoppingList = require("./lib/shopping-list");

const app = express(); // Create the Express application object `app`. 
const host = "localhost"; // define host to which app listens for HTTP connections.
const port = 3002; // define the port to which the app listens for HTTP connctions.
const sortShoppingLists = require("./lib/sort"); // import module for sorting shopping lists.

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

// Render new todo list page
app.get("/lists/new", (req, res) => {
  res.render("new-list");
});

// Create a new shopping list
app.post("/lists", (req, res) => {
  let title = req.body.shoppingListTitle.trim();

  if (title.length === 0) {
    req.flash("error", "A title was not provided.");
    res.render("new-list", {
      flash: req.flash(),
    });
  } else if (title.length > 100) {
    req.flash("error", "List title must be between 1 and 100 characters.");
    req.flash("error", "This is another error.");
    req.flash("error", "Here is still another error.");
    res.render("new-list", {
      flash: req.flash(),
      shoppingListTitle: req.body.shoppingListTitle,
    });
  } else if (shoppingLists.some(list => list.title === title)) {
    req.flash("error", "List title must be unique.");
    res.render("new-list", {
      flash: req.flash(),
      shoppingListTitle: req.body.shoppingListTitle,
    });
  } else {
    shoppingLists.push(new ShoppingList(title));
    req.flash("success", "The todo list has been created.");
    res.redirect("/lists");
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