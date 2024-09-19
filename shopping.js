const express = require("express"); // Load the `express` module.
const morgan = require("morgan"); // Load the `morgan` module.
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
    res.render("new-list", {
      errorMessage: "A title was not provided.",
    });
  } else if (title.length > 100) {
    res.render("new-list", {
      errorMessage: "List title must be between 1 and 100 characters.",
      todoListTitle: title,
    });
  } else if (shoppingLists.some(list => list.title === title)) {
    res.render("new-list", {
      errorMessage: "List title must be unique.",
      todoListTitle: title,
    });
  } else {
    shoppingLists.push(new ShoppingList(title));
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