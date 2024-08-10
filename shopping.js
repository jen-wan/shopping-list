const express = require("express"); // Load the `express` module.
const morgan = require("morgan"); // Load the `morgan` module.

const app = express(); // Create the Express application object `app`. 
const host = "localhost"; // define host to which app listens for HTTP connections.
const port = 3002; // define the port to which the app listens for HTTP connctions.

// Static data for initial testing
let shoppingLists = require("./lib/seed-data");

app.set("views", "./views"); // tell Express where to find view templates
app.set("view engine", "pug"); // Tell express to use Pug as the view engine.

app.use(morgan("common")); // Enable logging with Morgan.

app.get("/", (req, res) => { // primary route for this application
  res.render("lists", { shoppingLists }); // renders the lists.pug view
});

// Listener
app.listen(port, host, () => {
  console.log(`Shopping is listening on port ${port} of ${host}!`);
});