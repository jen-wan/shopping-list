# Local host

- We can use http://localhost:3002 for the development of our app.
- **3000, 3001, 3002, etc.**: Often used for development environments, particularly with Node.js applications.



# Getting started

## create the project folder

- Create the project as an NPM module.
- Ideally we should create a Git repository for the project.

```terminal
$ mkdir ~/projects/todos-js175 # the location of your project may be different
$ cd ~/projects/todos-js175
$ mkdir lib views
$ npm init      # Set the entry point to todos.js
$ git init .
$ git add -A
$ git commit -m "Initial commit"
```

## Create the assets

- Put asset files in a folder `public` with two categories `images` and `stylesheets`

## Create the project code 

- We need to create a `ShoppingList` and `Item` class. Put the `shoppingList.js` and `item.js` files in the `lib` folder, along with `next-id.js` file to handle object ID generation. 
- PAY ATTENTION TO LINE 72 `filter` is a custom method overriding the build in `filter`. 
- PAY ATTENTINO TO LINE 67, `forEach` is a custom method that iterates over `this.items`. 
- There are also other methods with same name as methods in `item.js`, so be careful!. 

lib/shoppingList.js

```js
const nextId = require("./next-id");
const Item = require("./item");

class ShoppingList {
  constructor(title) {
    this.id = nextId();
    this.title = title;
    this.items = [];
  }

  add(item) {
    if (!(item instanceof Item)) {
      throw new TypeError("can only add Item objects");
    }

    this.items.push(item);
  }

  size() {
    return this.items.length;
  }

  first() {
    return this.items[0];
  }

  last() {
    return this.items[item.size() - 1];
  }

  itemAt(index) {
    this._validateIndex(index);
    return this.items[index];
  }

  markPurchasedAt(index) {
    this.itemAt(index).markPurchased();
  }

  markNotPurchasedAt(index) {
    this.itemAt(index).markNotPurchased();
  }

  isPurchased() {
    return this.size() > 0 && this.items.every(item => item.isPurchased());
  }

  shift() {
    return this.items.shift();
  }

  pop() {
    return this.items.pop();
  }

  removeAt(index) {
    this._validateIndex(index);
    return this.items.splice(index, 1);
  }

  toString() {
    let title = `---- ${this.title} ----`;
    let list = this.items.map(item => item.toString()).join("\n");
    return `${title}\n${list}`;
  }

  forEach(callback) {
    this.items.forEach(item => callback(item));
  }
  
  filter(callback) {
    let newList = new ShoppingList(this.title);
    this.forEach(item => {
      if (callback(item)) {
        newList.add(item);
      }
    });

    return newList;
  }

  findByTitle(title) {
    return this.filter(item => item.title === title).first();
  }

  findById(id) {
    return this.filter(item => item.id === id).first();
  }

  findIndexOf(itemToFind) {
    // findIndex() returns the index of the first element in an array that satifies
    // the provided testing function. 
    return this.items.findIndex(item => item.id === itemToFind.id); 
  }

  allPurchased() {
    return this.filter(item => item.isPurchased()); // isPurchased is a custom method
  }

  allNotPurchased() {
    return this.filter(item => !item.isPurchased()); 
  }

  // _ indicates that parameter is present but not used.
  allItems() {
    return this.filter(_ => true);
  }

  markPurchased(title) {
    let item = this.findByTitle(title);
    if (item !== undefined) {
      item.markPurchased();
    }
  }

  markAllPurchased() {
    this.forEach(item => item.markPurchased());
  }

  toArray() {
    return this.items.slice();
  }

  setTitle(title) {
    this.title = title;
  }

  _validateIndex(index) { // _ indicates a "private" method, unenforced
    if (!(index in this.items)) {
      throw new ReferenceError(`invalid index: ${index}`);
    }
  }
}

module.exports = ShoppingList;
```

lib/next-id.js

```js
// This module is used to generate a unique ID number for todo list and todo objects.
let currentId = 0;

let nextId = () => { // this is a closure by the way. :)
  currentID += 1;
  return currentId;
};

module.exports = nextId;
```

lib/item.js

```js
const nextId = require("./next-id"); // ./ represnts current directory

class Item {
  constructor(title) {
    this.id = nextId();
    this.title = title;
    this.purchased = false;
  }

  markPurchased() {
    this.bought = true;
  }

  markNotPurchased() {
    this.purchased = false;
  }

  isPurchased() {
    return this.purchased;
  }

  setTitle(title) {
    this.title = title;
  }
}

Item.PURCHASED_MARKER = "X";
Item.NOT_PURCHASED_MARKER = " ";

module.exports = Item;
```



## install Express and pug

- You should install Express and Pug as local modules to ensure that your project always uses the same versions of both. 
- You should also install `nodemon` as a development dependency so that you can see the effects of your code changes without having to restart the server.

```terminal
$ npm install express pug morgan --save
$ npm install nodemon --save-dev
```

- If you have some other modules that you want to install (e.g., `eslint`), you should do so now.

## Initial code

Let's make sure everything is ready to go. First, create a minimal Express program configured to use Pug with logging by morgan. It displays a simple page from the `lists.pug` view template:

shopping.js

```js
const express = require("express"); // Load the `express` module.
const morgan = require("morgan"); // Load the `morgan` module.

const app = express(); // Create the Express application object `app`. 
const host = "localhost"; // define host to which app listens for HTTP connections.
const port = 3002; // define the port to which the app listens for HTTP connctions.

app.set("views", "./views"); // tell Express where to find view templates
app.set("view engine", "pug"); // Tell express to use Pug as the view engine.

app.use(morgan("common")); // Enable logging with Morgan.

app.get("/", (req, res) => { // primary route for this application
  res.render("lists"); // renders the lists.pug view
});

// Listener
app.listen(port, host, () => {
  console.log(`Shopping is listening on port ${port} of ${host}!`);
});
```

We've already seen a program like this in the previous lesson. Nevertheless, here's a quick refresher run-through:

- **Line 1** Load the `express` module.
- **Line 2** Load the `morgan` module.
- **Line 4** Create the Express application object, `app`.
- **Lines 5-6** Define the host and port to which that the app listens for HTTP connections.
- **Line 8** Tell Express where to find view templates.
- **Line 9** Tell express to use Pug as the view engine.
- **Line 11** Enable logging with morgan.
- **Lines 13-15** The primary route for this application. It handles GET requests to the `/` path and renders the `lists.pug` view.
- **Lines 17-19** Tell Express to listen for HTTP requests on the specified host and port.

This `lists.pug` view renders a simple web page:

views/lists.pug

```jade
doctype html

html(lang="en-US")
  head
    title Todo App
  body
    header
      h1 Todo Tracker
```

Again, we've already discussed the basics of Pug; we don't need to go into much detail here:

- **Line 1** Tell the browser to expect HTML5 (boilerplate).
- **Lines 3, 4, and 6** The HTML structure (boilerplate)
- **Line 5** Provides the text that the browser should display in the window title bar or tab.
- **Lines 7-8** Define the page header and heading (`Todo Tracker`).

Remember: we don't expect you to master Pug. Most of the time, we'll provide the code that you need. However, the very concept of a templating language is important. You may never use Pug again, but it's likely that you will use something similar.

Next, we need to add a `start` script to the `scripts` section of the `package.json` file; this script starts the `todos.js` server.

package.json

```js
// omitted code
"scripts": {
  "start": "npx nodemon todos.js"
},
// omitted code
```

You can now start the server with the following command:

```terminal
$ npm start
```

Finally, point your browser to [http://localhost:3000](http://localhost:3000/). 

# create the html and css for the project

- Create the HTML, then convert it into pug templates [converter](https://pughtml.com/), and place the files in the `views` folder.

- We will have 5 different **views**: a view is a template that represents the structure and layout of HTML content in a web application.
- `layout.pug`
  - This layout will create the basic structure of the page mainly the header and "headerlinks".
- `lists.pug`
  - This layout will extend `layout.pug`
  - This page will display all of the current shopping lists.
  - It's also the starting and main homepage.
- `new-list.pug`
  - This layout will extend `layout.pug` and display a page that can create a new-list.
- `list.pug`

  - This layout will extend `layout.pug`
  - This layout will display a specific shopping list.

  - It will have the option to add a new item to the shopping list.
- `edit-list.pug`
  - This layout will allow you to edit a specific list.

# The Home page

- We'll start with the home page, which displays the list of all todo lists.

![No todo lists](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/the-home-page-01.png)

## The Layout File

- To render this page, we need a couple of Pug view templates. First, let's create a `views/layout.pug` file. This file describes the overall layout of every page in the application. 

- It's not a very complex layout, so let's just put it together all at once:

views/layout.pug

```jade
doctype html

html(lang="en-US")

  head
    title Todo App
    meta(charset="UTF-8")
    link(rel="stylesheet" href="//fonts.googleapis.com/css?family=PT+Sans")
    link(rel="stylesheet" href="/stylesheets/whitespace-reset.css")
    link(rel="stylesheet" href="/stylesheets/application.css")

  body
    header
      h1 Todo Tracker
      block headerLinks

    main
      block main
```

Beneath the `head` tag in the Pug template is some code that does the following:

- `title` identifies the page title, which generally appears in a browser's title bar or a browser tab. We'll use the same title, `Todo App` on every page of our application.
- `meta(charset="UTF-8")` tells the browser that our document uses the UTF-8 character set. This character set is pretty standard for English-language web pages.
- The `link` tags tell the browser to use three different stylesheets to stylize the output.
  - The first link loads a font from Google, while the next two load the stylesheets we provided in `todos-assets.zip`. 
  - These two files provide the styling information that we need for our project. Feel free to look them over (they're in `public/stylesheets`) if you're already familiar with CSS; if not, don't worry about them.


Beneath the `body` tag is the code that describes the content of each page:

- The `header` section defines the page header. It includes a top-level heading (`h1`) that renders `Todo Tracker` at the top of every page. We also provide a `block` tag that loads some option information from the remaining views.
- The `main` section defines the main page content. The content, which is identified by `block main`, gets loaded from the remaining views.

## The List of Todo Lists View

- The main page of our application uses the `views/lists.pug` file to render the main content. 
- We've replaced it with the following:

views/lists.pug

```jade
extends layout

block main
  if todoLists === undefined || todoLists.length === 0
    p#no_list You don't have any todo lists. Why not create one?
  else
    p You have some lists. We need to list them.

block headerLinks
  .actions
    a.add(href="/lists/new") New List
```

- As we saw in the previous lesson, this file contains an `extends layout` statement that tells Pug to start rendering the page with `layout.pug`. The layout file, in turn, has two `block` tags name `main` and `headerlinks`. Pug looks for corresponding `block` statements in `lists.pug` to provide the necessary content.

- In this case, `block main` defines some code that replaces the `block main` code inside the layout template. Here, the replacement code tests whether the list of todo lists represented by `todoLists` is empty, and displays one of two messages depending on the result.

- We'll talk more about where `todoLists` comes from shortly.

##### hyphen-space format is no longer used

- You may sometimes see `if` and `else` written like this:

views/lists.pug

```jade
- if (todoLists.length === 0)
  p#no_list You don't have any todo lists. Why not create one?
- else
  p You have some lists. We need to list them.
```

- This hyphen-and-space format is no longer needed for `if` statements. However, you may still see the hyphen format used to execute plain JavaScript. For instance:

views/lists.pug

```jade
- console.log("Log a message")
```

##### `p#no_list` ID tag

- In the "list is empty" branch, we write the message with `p#no_list`; the `#no_list` assigns an HTML `id` attribute to the resulting HTML. 
- In this case, the result is some special styling for the output, as determined by the `application.css` file:
- While you don't need to understand that CSS right now, it provides the styling that lets us center the specified text and draw an arrow that points to the `New List` button.

public/stylesheets/application.css

```css
#no_list {
  background: transparent url("../images/arrow_new_list.png") 85% 0 no-repeat;
  padding: 128px 0 0;
  text-align: center;
}
```

##### Block headerlinks and syntax

-  The `block headerlinks` code lets us add a stylized link for creating a new list. Since the CSS involved is rather complicated, we won't discuss it here. However, it adds a plus-in-a-circle icon just before the `New List` link; that icon rotates when the user moves her cursor pointer over the link.

```js
block headerLinks
  .actions //- this generates a div element with class name actions
    a.add(href="/lists/new") New List // - anchor element with class name add
```

When converted to html is

```html
<div class="actions">
  <a class="add" href="/lists/new">New List</a>
</div>
```

- `.actions` generates a `div` element with a class of `actions`. It is shorthand for 

  ```html
  <div class="actions"></div>
  ```

- **`a.add(href="/lists/new") New List`**: This is pug shorthand for creating an anchor (`<a>`) tag with additional class names and attributes.

## Initial testing server code

- Before we can run our code, we need to make a couple of minor changes to `todos.js`:

todos.js

```js
const port = 3000;

// Static data for initial testing
let shoppingLists = require("./lib/seed-data");

app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static("public"));
```

- `require("./lib/seed-data")` loads some example data from `lib/seed-data.js` and assigns it to `todoLists` as an object. We can use this variable to access the list of todo lists.

- The `app.use` call tells Express that it can find its static assets in the `public` directory. Without this call, Express won't be able to find the images or stylesheets requested in the templates.

- Note that `todoLists` is not persistent. The data lasts so long as our application continues to run. Once the app stops or gets reloaded, any changes you made should go away. Keep that in mind as you move through this lesson: don't be surprised when data goes missing. We'll address this issue later.

- There's one final step before we can run the app: we need to create `lib/seed-data.js`. For now, this module merely returns a reference to an empty array:

lib/seed-data.js

```js
module.exports = [];
```

Go ahead and try the app again. It should display the page shown at the top of this page.

## Adding Seed Data

- Let's add some data to our seed data file:
- If you view the program in your browser, you still won't see any data, just the same page you saw before. The problem here is that the view needs to access the `todoLists` variable, but it doesn't have that access yet. We'll fix that and display the seed data in the next assignment.

lib/seed-data.js

```js
const ShoppingList = require("./shopping-list");
const Item = require("./item");

let shoppingList1 = new ShoppingList("Work Items");
shoppingList1.add(new Item("Coffee"));
shoppingList1.add(new Item("Pens"));
shoppingList1.add(new Item("Ipad"));
shoppingList1.markPurchased("White boards");
shoppingList1.markPurchased("Notebooks");

let shoppingList2 = new shoppingList("Home Items");
shoppingList2.add(new Item("Cups"));
shoppingList2.add(new Item("Almond Milk"));
shoppingList2.add(new Item("Desk"));
shoppingList2.add(new Item("Chair"));
shoppingList2.markPurchased("Piano");
shoppingList2.markPurchased("Speaker");
shoppingList2.markPurchased("Games");
shoppingList2.markPurchased("Watermelon");

let shoppingList3 = new shoppingList("Additional Items");

let shoppingLists = [
  shoppingList1,
  shoppingList2,
  shoppingList3,
];

module.exports = shoppingLists;
```

# Display All Todo Lists

- The home page should display the complete list of todo lists, together with the number of todos in each todo list and the number of done todos in each:
- However, the view template isn't receiving data: On line 4 of `views/lists.pug` the code looks for a `todoLists` variable and doesn't find one. So the template assumes that there are no todo lists.



![List of Todo Lists](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/display-all-todo-lists-01.png)



## Passing Data to the View

- Our view template expects us to use the `todoLists` variable. 
- So we should provide that variable by passing a second argument to the `res.render` invocation: an object whose properties are available as variables in the view:

todos.js

```js
app.get("/", (req, res) => {
  res.render("lists", { todoLists });
});
```

If you reload the page now, you should get some different results:



![Boring Todo Lists](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/display-all-todo-lists-02.png)



We get this somewhat uninformative output since the Pug view isn't prepared to deal with todo lists yet. However, it does at least tell us that we have some data.

## Updating the View to display the lists

Let's return to `views/lists.pug`, which currently looks like this:

views/lists.pug

```jade
extends layout 

block main 
  if shoppingLists === undefined || shoppingLists.length === 0 
    //- This creates a paragraph block with the ID tag no_list
    p#no_list You don't have any shopping lists. Why not create one? 
  else 
    ul#lists 


block headerLinks
  //- this generates a div element with class of actions
  .actions 
    a.add(href="/lists/new") New List
```

- We clearly must add some code to this view to display the list of todo lists instead of displaying `You have some lists. We need to list them.`. 
- For that, we can use an unordered list (the `ul` tag) and a Pug `each` loop to iterate over the todo lists in the list of lists:

views/lists.pug

```jade
block main
  if todoLists === undefined || todoLists.length === 0
    p#no_list You don't have any todo lists. Why not create one?
  else
    ul#lists
      each todoList in todoLists
        li(class=todoList.isDone() ? "done" : "")
          a(href=`/lists/${todoList.id}`)
            h2= todoList.title
            p #{todoList.allDone().size()} / #{todoList.size()}
```

There are several things to note about this code:

1. The Pug code expects to iterate over something called `shoppingLists`.
2. `ul#lists` defines an "unordered list" with an `id` attribute of `lists`.
3. Each iteration of the loop sets the Pug variable `shoppingList` to one of the `ShoppingList` objects in `shoppingLists`, which means that we can use some `ShoppingList` properties and methods, namely `shoppingList.isPurchased()`, `shoppingList.id`, `shoppingList.title`, and `shoppnigList.size()`.
4. For each done todo list, we set the list item class to `"purchased"`. Our CSS uses this class to change the red bullet that displays next to most todo lists to a checked box. It also grays out and strikes through the list title of done lists. Don't worry if you don't understand how this works. You merely have to remember that CSS can use classes to alter appearance.
5. For each shopping list, we write a line that shows the shopping list title and the counts. Pug treats the entire line as a hyperlink (the `a` tag) that links to `/lists/${shoppingList.id}`. Those links won't work right now, but we'll remedy that in a later assignment.

For the moment, don't worry about the different ways we call the methods in this code (item 3). We discussed Pug's interpolation syntax in the previous lesson. We've provided a short refresher below.

## Refresher: Interpolation in Pug

Notice that we used several different ways to interpolate the return values of the `TodoList` methods.

```jade
h2= todoList.title
p #{todoList.allDone().size()} / #{todoList.size()}
${todoList.id}
```

We discussed interpolation in the previous lesson. Let's refresh our memory.

- When you append an `=` to a tag name, e.g., `h2=`, everything to the right is treated as a JavaScript expression. Pug evaluates the expression, and uses the return value (after coercion to a string) as the value passed to the tag. For instance, if `todoList.title` returns `"Work Todos"`, then:

  ```jade
  h2= todoList.title
  ```

  is equivalent to:

  ```jade
  h2 Work Todos
  ```

- If you don't append an `=` to a tag name, then JavaScript code must be wrapped inside `#{...}`. This is similar to JavaScript's template literal syntax, but uses `#` instead of `$`. Pug evaluates the `#{...}` expressions, and replaces them with the return value, coerced to a string if needed. Thus, if `todoList.title` returns `"Work Todos"` and `today()` returns `"Monday"`, then:

  ```jade
  h2 #{todoList.title} for #{today()}
  ```

  is equivalent to:

  ```jade
  h2 Work Todos for Monday
  ```

- When assigning values to attributes inside parentheses, Pug expects a JavaScript expression to the right of each `=`. Thus, if you want a dynamic attribute value, you can use a template literal:

  ```jade
  a(href=`/lists/${todoList.id}`)
  ```

  You can also use a JavaScript expression:

  ```jade
  a(href="/lists/" + todoList.id)
  ```

  Either way, the value is coerced to a string.

As we mentioned in the previous lesson, interpolation in Pug can be confusing, especially at first. You should get more comfortable with this in time, but, for now, bookmark the [Pug Interpolation](https://pugjs.org/language/interpolation.html) and [Pug Attributes](https://pugjs.org/language/attributes.html) pages. Refer to them as needed.

## Testing Your Code

Go ahead and reload the application in your browser. It should display the list of todo lists that we showed at the beginning of this assignment.

## What our output looks like right now

<img src="C:\Users\jenny\AppData\Roaming\Typora\typora-user-images\image-20240810112809276.png" alt="image-20240810112809276" style="zoom:33%;" />

# Sort the Todo Lists

You may have noticed that the home page doesn't display the list of todo lists in any particular order. It shows them in the same sequence that we used in the `seed-data` module. Ideally, we'd like to sort the lists by title, with the done todo lists at the bottom of the list. Let's see how we can accomplish that.

## Where to Sort

There are several places we can sort the list:

- In the `seed-data` module.
- In the `views/lists.pug` view.
- In the `todos.js` file.

Sorting in the `seed-data` module wouldn't work too well. For one thing, it's only seed data. We won't use that module in the final program, so it's a poor place to implement sorting. Furthermore, our application updates the data. If we sorted the data before the user updated it, we'd only have to re-sort it.

We could also sort the lists in the view by using something called a "view helper." We won't cover view helpers right now since we don't usually use them unless two or more views need some shared functionality. That isn't the case with our sorting function or any of the view templates that we'll create. The only time that we need a sorted list of todo lists is in the `lists` view, so a view helper isn't appropriate.

That leaves the `todos.js` file. We can perform the sort just before we render the `lists` view, and pass the sorted lists to `res.render` for use by the view:

todos.js

```js
// Render the list of todo lists
app.get("/", (req, res) => {
  res.render("lists", {
    todoLists: sortTodoLists(todoLists),
  });
});
```

## Sort by Title

Let's define our `sortTodoLists` function now. It takes a single array argument that contains all of our todo lists, and it returns a new array that contains the sorted todo lists. For the moment, let's sort the list in the standard string order based on the todo list titles:

todos.js

```js
// Add this code just after the `app.use` invocations.

// return the list of todo lists sorted by completion status and title.
const sortTodoLists = lists => {
  return lists.slice().sort((todoListA, todoListB) => {
    let titleA = todoListA.title;
    let titleB = todoListB.title;

    if (titleA < titleB) {
      return -1;
    } else if (titleA > titleB) {
      return 1;
    } else {
      return 0;
    }
  });
};
```

Note that we called `slice` before sorting so that sorting doesn't mutate the original list as a side effect.

If you run the application now, you should see this in your browser:



![Sorted List of Todo Lists by title only](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/sort-the-todo-lists-01.png)



## Move the Done Todo Lists to the End

To move the done todo lists to the end of the sort sequence, we can expand the `sortTodoLists` function a bit:

todos.js

```js
// return the list of todo lists sorted by completion status and title.
const sortTodoLists = lists => {
  return lists.slice().sort((todoListA, todoListB) => {
    let isDoneA = todoListA.isDone();
    let isDoneB = todoListB.isDone();

    if (!isDoneA && isDoneB) {
      return -1;
    } else if (isDoneA && !isDoneB) {
      return 1;
    } else {
      let titleA = todoListA.title;
      let titleB = todoListB.title;

      if (titleA < titleB) {
        return -1;
      } else if (titleA > titleB) {
        return 1;
      } else {
        return 0;
      }
    }
  });
};
```

Since we want all of the completed todos to come after the undone todos, it makes sense to make that comparison first. When both todo lists have the same completion state, we can compare the titles.

Go ahead and take a look at the list of todo lists now:



![Sorted List of Todo Lists by title and completion status](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/sort-the-todo-lists-02.png)



## Refactoring the Sort Callback

The sort callback might benefit from a bit of refactoring. It's not difficult to read. However, a lot is going on; perhaps we can simplify it a bit.

We'd get the same sort order if we first sorted the undone todo lists, then sorted the done todo lists, and finally concatenated the results. That's two distinct operations, which suggests that refactoring may be in order. Give it a try before looking at our solution:

Hide refactored code

todos.js

```js
// return the list of todo lists sorted by completion status and title.
const sortTodoLists = lists => {
  const compareByTitle = (todoListA, todoListB) => {
    let titleA = todoListA.title;
    let titleB = todoListB.title;

    if (titleA < titleB) {
      return -1;
    } else if (titleA > titleB) {
      return 1;
    } else {
      return 0;
    }
  };

  let undone = lists.filter(todoList => !todoList.isDone());
  let done   = lists.filter(todoList => todoList.isDone());
  undone.sort(compareByTitle);
  done.sort(compareByTitle);
  return [].concat(undone, done);
};
```

That's a bit less code than we started with, but it may also be easier to comprehend. You could even move the comparison function elsewhere so that it isn't "in your face:"

todos.js

```js
// Compare todo list titles alphabetically
const compareByTitle = (todoListA, todoListB) => {
  let titleA = todoListA.title;
  let titleB = todoListB.title;

  if (titleA < titleB) {
    return -1;
  } else if (titleA > titleB) {
    return 1;
  } else {
    return 0;
  }
};

// return the list of todo lists sorted by completion status and title.
const sortTodoLists = lists => {
  let undone = lists.filter(todoList => !todoList.isDone());
  let done   = lists.filter(todoList => todoList.isDone());
  undone.sort(compareByTitle);
  done.sort(compareByTitle);
  return [].concat(undone, done);
};
```

That might make the function easier to understand, provided you have a good idea of what the comparison function does. The name `compareByTitle` certainly helps.

## Case-Insensitive Sorting

Let's see what happens if some of our todo lists have lowercase titles. How will that affect the sort order? Start by adding a new todo list to the end of the lists of todo lists in the `seed-data` module:

lib/seed-data.js

```js
let todoList3 = new TodoList("Additional Todos");

let todoList4 = new TodoList("social todos");
todoList4.add(new Todo("Go to Libby's birthday party"));

let todoLists = [
  todoList1,
  todoList2,
  todoList3,
  todoList4,
];
```

The results should look like this:



![Sorted List of Todo Lists by case-sensitive title and completion status](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/sort-the-todo-lists-03.png)



Is that what we want? Perhaps, perhaps not. We sometimes want to distinguish between uppercase and lowercase strings. Often, though, we don't. In this case, we should sort the data in a case-insensitive manner:

todos.js

```js
// Compare todo list titles alphabetically (case-insensitive)
const compareByTitle = (todoListA, todoListB) => {
  let titleA = todoListA.title.toLowerCase();
  let titleB = todoListB.title.toLowerCase();

  if (titleA < titleB) {
    return -1;
  } else if (titleA > titleB) {
    return 1;
  } else {
    return 0;
  }
};
```

That should do the trick. Your browser should now show:



![Sorted List of Todo Lists by case-insensitive title and completion status](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/sort-the-todo-lists-04.png)



That looks better, and most users would probably prefer this output.

# Add a New Todo List

Now that our home page works, it's time to begin building the rest of the application. In particular, we should learn how to update the data. We'll start by creating and adding new todo lists.

## Create a New Todo List Form

When you click the `New List` button or the rotating icon 

![rotating icon](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/icon_add.png)

 to its left, the app should display a new page where we can create the new todo list. The page should look like this:





![New List form](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/add-a-new-todo-list-01.png)



To create this form, we need two things: a Pug view that describes the form and a route that renders the view. Here's the view code:

views/new-list.pug

```jade
extends layout

block main
  form(action="/lists" method="post")
    dl
      dt
        label(for="todoListTitle") Enter the title for your new list:
      dd
        input(type="text"
              id="todoListTitle"
              name="todoListTitle"
              placeholder="List Title")

    fieldset.actions
      input(type="submit" value="Save")
      a(href="/lists") Cancel
```

As with `lists.pug`, we first tell Pug to use `layout.pug` as the layout file, then define the main content area. The markup includes a `form`, which is a component that collects information from the user. The `action` and `method` attributes tell the browser what to do when the user submits the form; in this case, the browser should submit a POST request to the server with the path `/lists`, e.g., `http://localhost:3000/lists` in this case. Note that the `name` attribute on line 11 defines the name that we'll use to access this field: `todoListTitle`.

Inside the form, we use a definition list (`dl`) to display a text label and an input box for the new todo list's title. We also have a `Save` button and a link to cancel the form.

## Defining a Route to the Form

This part is straightforward: decide on what path we want to use, then implement an appropriate route. Our route processes GET method requests made to `/lists/new`:

todos.js

```js
// Add this code just before the call to `app.listen` at the bottom of the file

// Render new todo list page
app.get("/lists/new", (req, res) => {
  res.render("new-list");
});
```

That's all you need to do to render this form. Go ahead and reload the app to see the results. Note, however, that you can't submit it yet. Neither the `Save` nor the `Cancel` button is "hooked up" and ready to use. Let's do that next.

From time to time, especially in `todos.js`, we will tell you where to add code to the file. Mostly, it doesn't matter too much where you put the code, but there are places where it does. In particular, the `app.set` calls should be first, followed by `app.use`, then `app.get` and `app.post`, and, finally, `app.listen`. In addition, some specific `app.get`/`app.post` invocations can be order-dependent. We'll point those out as we come to them.

The remaining notes about placement are mostly to help keep things organized. Don't worry too much about trying to determine the exact placement rules that we're using. Stick to the sequence of calls described above, and you should be okay.

## Hooking Up the Cancel Button

The view defines the Cancel button as a link:

```jade
a(href="/lists") Cancel
```

The `href` attribute causes the resulting link to issue a GET request to the `/lists` path when we click the link.

When you click the `Cancel` button, your browser should return to the todo application's home page. Let's make sure that happens by creating a new route:

todos.js

```js
// Add this code between the two existing routes: get("/") and get("/lists/new")

// Render the list of todo lists
app.get("/lists", (req, res) => {
  res.render("lists", {
    todoLists: sortTodoLists(todoLists),
  });
});
```

The app should now display the list of todo lists when you click the `Cancel` button.

Notice that the code for the `/lists` route callback is identical to that for `/`. We can -- and should -- address that by converting the callback for `/` to use a redirect:

todos.js

```js
// Redirect start page
app.get("/", (req, res) => {
  res.redirect("/lists");
});
```

If you navigate to http://localhost:3000/, the redirect sends you to `http://localhost:3000/lists` instead.

## Hooking Up The Submit Button

We're now ready to create a new todo list when the user submits the form. Form submission usually occurs when the user clicks the button that represents an `input` item with the `type="submit"` attribute. In this case, we have a submit button that contains the word `Save`:

```jade
input(type="submit" value="Save")
```

There are other ways to trigger form submission, but clicking the submit button is the most obvious. Regardless of how you submit the form, the browser sends an HTTP POST request to the URL `/lists`, as defined by the `method` and `action` attributes of the `form` tag:

```jade
form(action="/lists" method="post")
```

That means that we need a route to handle POST requests to the `/lists` path:

todos.js

```js
// Add the following code after the `get` route for `/lists/new`

// Create a new todo list
app.post("/lists", (req, res) => {
  let title = req.body.todoListTitle.trim();
  todoLists.push(new TodoList(title));
  res.redirect("/lists");
});
```

In this code, `req.body` provides access to the values the user entered on the form based on the `name` attribute of each item. Our lone input field is named `todoListTitle`, so we can use `req.body.todoListTitle` to grab its value. Since leading and trailing whitespace can be troublesome in most applications, we use `trim` to get rid of it. Next, we create a new `TodoList` object with the indicated title and push it onto our list of todo lists. Finally, we use `res.redirect` to create a response that redirects the browser back to the `get` version of the `/lists` route.

Don't forget to load the `todolist` module:

todos.js

```js
const express = require("express");
const morgan = require("morgan");
const TodoList = require("./lib/todolist");
```

If you try to add a new todo list now, you should get an error:

```plaintext
TypeError: Cannot read property 'todoListTitle' of undefined
```

Before we can add a todo list, we need to tell Express about the format used by the form data. For many applications, that would be JSON. However, we can rely on the standard format used in HTML forms: URL-encoded:

todos.js

```js
app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
```

Note that we don't do any error checking or input sanitation (other than trimming whitespace) yet. We'll add that in future assignments. We also have two different routes for the `/lists` URL: one for the GET method, and one for the POST method. The two routes are distinct: the GET route displays the new list form, while the POST route creates and adds a new todo list based on the form data.

Go ahead and add 2 or 3 new todo lists. The resulting list of todo lists should look something like this:



![New Lists](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/add-a-new-todo-list-02.png)



In this example, we've added `Grocery List`, `Birthdays List`, and `Television Shows to Watch` to our list of todo lists.

Don't worry if some data you entered previously gets lost. In this lesson, we're not trying to preserve the data, so each restart of the app resets the data.

# Validating New Todo Lists

What happens when you try to create a new todo list without a title? How about when you enter an extremely long title? Suppose the new todo list title is already present in the list of todo lists; what then? All these questions are the subject of validation, which we'll discuss in this assignment and the next.

## Check for Missing Titles

If you try to create a new todo list without a title, the app, in its current state, will happily create it:



![List of todo lists with an empty title](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/validating-new-todo-lists-01.png)



That empty title sure looks strange. What's more, if you create another todo list with no title, you'll have two such lists at the top of the page. Clearly, we need to check for missing titles. Let's see what we can do to address this issue.

Here's the current route for POST requests to the `/lists` path:

todos.js

```js
// Create a new todo list
app.post("/lists", (req, res) => {
  let title = req.body.todoListTitle.trim();
  todoLists.push(new TodoList(title));
  res.redirect("/lists");
});
```

In pseudocode, that looks something like this:

```plaintext
Get and trim the title from the request body
Create a new todo list with the title
Add the new todo list to the list of todo lists
Redirect browser to /lists
```

Somewhere in there, we must check for an empty list title. If it's omitted, we should do something different. In particular, we should redisplay the form with an error message. That leads to some updated pseudocode that looks like this:

```plaintext
Get and trim the title from the request body
If title is empty
  Set an error message
  Re-render the new todo list form
Else
  Create a new todo list with the title
  Add the new todo list to the list of todo lists
  Redirect to /lists
```

In code, that gives us:

todos.js

```js
// Create a new todo list
app.post("/lists", (req, res) => {
  let title = req.body.todoListTitle.trim();
  if (title.length === 0) {
    res.render("new-list", {
      errorMessage: "A title was not provided.",
    });
  } else {
    todoLists.push(new TodoList(title));
    res.redirect("/lists");
  }
});
```

By convention, we use `render` to handle errors that redisplay the same page, and `redirect` to handle success. We can also use `redirect` for errors that display a new page rather than redisplaying the original page. Pay attention to the arguments for `res.render` and `res.redirect`: `render` uses the name of a view template, but `redirect` needs a path.

If you run the app, you can still create new todo lists, but if you try to create a todo list without a title, nothing much happens when you submit the form. The page may flicker a bit, but there's no way to tell why it isn't working. That's because we aren't displaying the error message. For that, we need to update one of the views.

Which one? The most obvious choice is to update the view that will show the error message, namely `new-list.pug`. However, we may need error messages on other screens. That suggests that `layout.pug` may be the best place to write the code for error messages. As it happens, that's where most Express+Pug apps put them. Our code looks like this:

views/layout.pug

```jade
body
  header
    h1 Todo Tracker
    block headerLinks

  main
    if errorMessage
      .flash.error
        p= errorMessage

    block main
```

The new code first checks to see whether we have an `errorMessage` variable, then displays the message if we do. In this case, we're putting the code inside a block that has `flash` and `error` CSS classes; those classes provide some styling for the error messages. They get displayed in a red/pink box that looks like this:



![Error message for untitled new todo list](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/validating-new-todo-lists-02.png)



Great! We can now see why the form isn't creating a new todo list.

## Check for Overly Long Titles

Another error that we may want to check for is an overly long title for the todo list. What's too long is subjective. An app may not care whether a field is, say, 3571 characters long. For our purposes, though, let's say that they shouldn't exceed 100 characters.

Making this change is straightforward. All we have to do is check the length of the title in our route callback, then re-render the view:

todos.js

```js
// Create a new todo list
app.post("/lists", (req, res) => {
  let title = req.body.todoListTitle.trim();
  if (title.length === 0) {
    res.render("new-list", {
      errorMessage: "A title was not provided.",
    });
  } else if (title.length > 100) {
    res.render("new-list", {
      errorMessage: "List title must be between 1 and 100 characters.",
    });
  } else {
    todoLists.push(new TodoList(title));
    res.redirect("/lists");
  }
});
```

That's it. You can now test it in your browser. Be sure to check what happens when you switch between an overly long title and no title at all, and then back again. Here are two long titles you can copy and paste into the form:

```plaintext
123456789 ABCDEFGHI jklmnopqr 123456789 ABCDEFGHI jklmnopqr 123456789 ABCDEFGHI jklmnopqr 123456789!!
123456789 ABCDEFGHI jklmnopqr 123456789 ABCDEFGHI jklmnopqr 123456789 ABCDEFGHI jklmnopqr 123456789!
```

The first line is 101 characters in length, while the second is 100 characters in length.

You may have noticed that the application wiped out your overly long title when it displayed the error message. We'll address that issue shortly.

## Check for Duplicate Titles

We probably don't want to have multiple todo lists with the same title in our list of todo lists, so let's check for that too. Again, the procedure is straightforward:

todos.js

```js
// Create a new todo list
app.post("/lists", (req, res) => {
  let title = req.body.todoListTitle.trim();
  if (title.length === 0) {
    res.render("new-list", {
      errorMessage: "A title was not provided.",
    });
  } else if (title.length > 100) {
    res.render("new-list", {
      errorMessage: "List title must be between 1 and 100 characters.",
    });
  } else if (todoLists.some(list => list.title === title)) {
    res.render("new-list", {
      errorMessage: "List title must be unique.",
    });
  } else {
    todoLists.push(new TodoList(title));
    res.redirect("/lists");
  }
});
```

## Preserve User Inputs

- In this code, we let the view know about the user's input by adding it as a property on the object passed to `res.render`.

As we mentioned earlier, our error handling suffers from an annoying problem: when an error occurs, any input the user entered disappears when the screen refreshes. We need some way for user inputs to persist when an error occurs. We can use the second argument to `res.render` to pass in the user's most recent inputs. First, though, let's update `new-list.pug` to look for a variable:

views/new-list.pug

```jade
extends layout

block main
  form(action="/lists" method="post")
    dl
      dt
        label(for="todoListTitle") Enter the title for your new list:
      dd
        input(type="text"
              id="todoListTitle"
              name="todoListTitle"
              placeholder="List Title"
              value=todoListTitle)

    fieldset.actions
      input(type="submit" value="Save")
      a(href="/lists") Cancel
```

The only difference here is that we now try to find the list title in a `todoListTitle` variable. If `todoListTitle` isn't defined, the input field gets set to an empty string. Otherwise, it gets set to the value of the variable. Let's define that variable for the view:

todos.js

```js
// Create a new todo list
app.post("/lists", (req, res) => {
  let title = req.body.todoListTitle.trim();
  if (title.length === 0) {
    res.render("new-list", {
      errorMessage: "A title was not provided.",
    });
  } else if (title.length > 100) {
    res.render("new-list", {
      errorMessage: "List title must be between 1 and 100 characters.",
      todoListTitle: title,
    });
  } else if (todoLists.some(list => list.title === title)) {
    res.render("new-list", {
      errorMessage: "List title must be unique.",
      todoListTitle: title,
    });
  } else {
    todoLists.push(new TodoList(title));
    res.redirect("/lists");
  }
});
```

In this code, we let the view know about the user's input by adding it as a property on the object passed to `res.render`. That allows the template to access the user's previous entry. (Note that we haven't supplied the user input for an empty title -- we don't need it.)

With these changes, input errors no longer cause loss of the user's input:



![Error handling when creating new lists](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/validating-new-todo-lists-03.png)

# Adding Flash Messaging

In the previous assignment, we learned how to handle validation errors and, in particular, how to display those messages. Our implementation was simple but effective. However, we often need more flexibility than that implementation provides. For instance, we may need to handle multiple error messages. We may also need other message types, such as informational, success, and debug messages.

One way to deal with this complexity is to use **flash messages**, which we met in the previous lesson. Flash messages are rendered once, then go away the next time the browser loads a new page. The page can display multiple flash messages and can mix in kinds of messages.

In this assignment, we'll modify our application to use flash messages with the `express-flash` module. Note that `express-flash` also requires `express-session`, which provides support for persisting data over multiple request/response cycles. (Make sure you don't install `express-sessions`; that's a different package.) Before we start, we should discuss why flash messages need persistence.

## Sessions

This section is a bit of a refresher. We talked about sessions and `express-session` in the previous lesson.

As you should recall, HTTP is a stateless protocol. HTTP applications, like our todo application, use request/response pairs that are independent of each other. Neither the client nor the server can tell what happened in previous cycles by merely looking at the current request and response. If we want to persist data, we need to use something on top of the HTTP request/response mechanism.

One way to accomplish this persistence is through sessions. Typically, the application server -- independently of the HTTP cycle -- stores information about the latest request and response, then sends the client a piece of data called a **cookie** in the headers of the HTTP response. The cookie can include many kinds of information. For our purposes, it contains a unique **session ID** that identifies the data that the application server saved away.

When the client sends a new request back to the server, it includes the cookie (and the session ID it contains) back to the server. The server, in turn, uses that session ID to access the stored information. From the user's point of view, the HTTP application appears to be stateful rather than stateless.

It may not be obvious why we need this mechanism to handle errors. After all, errors mostly occur while processing a POST request, so the application can easily include the error message in the response. Why, then, do we need sessions?

What happens, though, if we need to send a success message to the client? Most web applications handle success by sending a redirect response back to the client. The redirect doesn't include any useful data (such as error messages), just a header that tells the client what it needs to do next: request a new URL. That request starts a new request/response cycle, so any messages are lost.

With sessions, the server can preserve the state under the user's unique session ID during any request/response cycle. The user's browser, in turn, sends the unique session ID back with every request. If the server needs to access the preserved state, it can do so by using the session ID. `express-flash` uses `express-session` in precisely that way. With most error messages, `express-flash` doesn't need sessions, but it uses them regardless.

Flash messages are temporary messages that can be set in one request and displayed in the subsequent request.

## Install `express-flash` and `express-session`

We can install both modules with the following command:

```terminal
$ npm install express-flash express-session --save
```

## Handling Flash Messages in Pug

Our `layout.pug` file currently handles error messages like this:

views/layout.pug

```jade
main
  if errorMessage
    .flash.error
      p= errorMessage
```

Updating it to handle flash messages instead isn't too tricky, but we need to do more work than before. In particular, we may need to manage multiple messages as well as messages of different types. Furthermore, flash messages are stored as a single object in `req.session.flash`:

```js
{
  error: [
    "A title was not provided.",
    "Unable to comply.",
    "That is illogical."
  ],
  info: [ "I'm a doctor, not a bricklayer." ],
  success: [ "Engage!" ]
}
```

Thus, our template must handle the flash object when we pass it to the view. Here's our Pug code to replace the Pug code from above:

views/layout.pug

```jade
body
    header
      h1 Todo Tracker
      block headerLinks

    main
      - let kinds = Object.keys(flash || {});
      if kinds.length > 0
        ul
          each kind in kinds
            each message in flash[kind]
              li.flash(class=kind)= message

      block main
```

Note that we reference `flash || {}` on line 1 in case `flash` is `undefined` or `null`. Without `|| {}`, `Object.keys(flash)` would raise an error if `flash` wasn't set.

## Handling Flash Messages in JavaScript

In JavaScript, we need to import and set up both `express-flash` and `express-session`.

todos.js

```js
const express = require("express");
const morgan = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const TodoList = require("./lib/todolist");
```

todos.js

```js
// Add the following code after app.use(express.urlencoded(...);
app.use(session({
  name: "launch-school-todos-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "this is not very secure",
}));

app.use(flash());
```

Refer to the previous lesson if you need to refresh your memory on what this code does. 

Note that we're using `express-session`'s built-in memory store for this project. You can add a more permanent store on your own if you wish.

Remember: the `secret` value is sensitive data that needs protection from prying eyes. Including it in the source code -- as we do here -- isn't safe. However, since we only respond to requests from the localhost, we're safe for now. **Don't make this program more widely available without addressing this issue**.

We can now define our error messages with `req.flash`. While we're at it, let's add a success message when we create a new todo list.

todos.js

```js
// Create a new todo list
app.post("/lists", (req, res) => {
  let title = req.body.todoListTitle.trim();

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
      todoListTitle: req.body.todoListTitle,
    });
  } else if (todoLists.some(list => list.title === title)) {
    req.flash("error", "List title must be unique.");
    res.render("new-list", {
      flash: req.flash(),
      todoListTitle: req.body.todoListTitle,
    });
  } else {
    todoLists.push(new TodoList(title));
    req.flash("success", "The todo list has been created.");
    res.redirect("/lists");
  }
});
```

Note that we must now define a `flash` variable for our view with the flash object returned by `req.flash()`.

If you run the program now, you should see that it continues to handle error messages as before. We added two additional error messages so that you can see that it manages multiple messages correctly. (You can delete those messages after you've seen how they work.) If you try to create a todo list, however, you won't see the success message. We'll deal with that in the next section.

That code is getting just a bit messy. We'll do some refactoring later.

## Flash Messages and Redirects

When you tried to create a new todo list during that last test, the success message didn't make it through the redirect. The reason for that is that the route callback for `/lists` doesn't pass flash messages into `render`, so the `layout.pug` file can't see them. We could pass the messages directly to the view:

todos.js

```js
// DON'T ADD THIS CODE TO YOUR PROGRAM

// Render the list of todo lists
app.get("/lists", (req, res) => {
  res.render("lists", {
    todoLists: sortTodoLists(todoLists),
    flash: req.flash(),
  });
});
```

However, we would have to add that code to every `render` invocation. A better way to handle flash messages on a redirect is to use some middleware that extracts the messages and puts them in `res.locals`:

todos.js

```js
// Add this code after `app.use(flash());`

// Extract session info
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});
```

Now the flash messages from before the `redirect` are available for use in views rendered by `res.render`. If you create a new todo list now, the success message should appear on the list of todo lists page.

# Validation and Sanitization

In the last two assignments, we learned how to handle input data validation for new todo lists. That process was generally straightforward, but also somewhat repetitive. Each error requires us to create an error message, preserve the user inputs, and then re-render the page. We may also have to deal with duplicate validations in multiple routes. We'd rather avoid such repetitive code and the associated maintenance costs. Let's refactor the code a bit. However, instead of a straight refactor, we'll use the `express-validator` module to validate our data.

## Setting Up

Take a moment to install `express-validator`. You should be comfortable with this procedure by now, so see if you can do it without peeking at the command:

Hide Installation Command

```terminal
$ npm install express-validator --save
```

We also need to load two functions from the module in our application file:

todos.js

```js
const express = require("express");
const morgan = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const { body, validationResult } = require("express-validator");
const TodoList = require("./lib/todolist");
```

Note that we've imported two functions from `express-validator`: `body`, which we'll use to create validators, and `validationResult`, which we'll use to validate the results.

Let's see how we use Express-Validator.

## Using Express-Validator

We'll continue to use the **validation chain API** that we discussed in the previous lesson. Recall that the conventional syntax passes an array of validation chains to the route.

Here's what it looks like in our code:

todos.js

```js
app.post("/lists",
  [
    body("todoListTitle")
      .trim()
      .isLength({ min: 1 })
      .withMessage("The list title is required.")
      .isLength({ max: 100 })
      .withMessage("List title must be between 1 and 100 characters.")
      .custom(title => {
        let duplicate = todoLists.find(list => list.title === title);
        return duplicate === undefined;
      })
      .withMessage("List title must be unique."),
  ],
  (req, res) => {
    let errors = validationResult(req); 
    if (!errors.isEmpty()) {
      errors.array().forEach(message => req.flash("error", message.msg));
      res.render("new-list", {
        flash: req.flash(),
        todoListTitle: req.body.todoListTitle,
      });
    } else {
      todoLists.push(new TodoList(req.body.todoListTitle));
      req.flash("success", "The todo list has been created.");
      res.redirect("/lists");
    }
  }
);
```

If you have trouble understanding what this code does, be sure to reread the introduction to `express-validator` from the previous lesson.

Note that we used a `custom` validator to prevent duplicate entries on the list of todo lists.

The second part of this code is the error handler. It's almost identical to what we saw in the previous lesson, except for the arguments passed to `res.render`.

Finally, the primary callback for the route gains control. It uses the list title from the form body (`req.body.todoListTitle`) to create a new todo list and add it to `todoLists`. It then sets a "success" flash message and redirects the browser back to the `/lists` page.

At this time, you should make sure your `New List` page in your application is still working as intended.

# Debugging Server Applications

In the remainder of this lesson, you'll have several opportunities to write and add your own code to the Todo app. You will probably encounter some bugs along the way. If you're used to using the node command line debugger, you'll quickly realize that it's not up to the job. You can use `console.log`, of course, but that's slow and tedious. Better yet would be able to do the debugging in a nice graphical interface where everything you need is right there. For that, we'll use Google Chrome's Developer Tools.

It may take you years to learn everything that the debugger in Chrome's Developer Tools offers, but you can get started with only a few simple things. To get you started, check out this [short tutorial](https://www.digitalocean.com/community/tutorials/how-to-debug-node-js-with-the-built-in-debugger-and-chrome-devtools#step-3-—-debugging-nodejs-with-chrome-devtools). You can read the first two steps on this page if you want, but the important part for now is learning the Chrome DevTools, which starts at Step 3.

If you want to practice using the Chrome debugger, try making some mistakes as you build the Todo app in the coming assignments -- not syntax mistakes, but mistakes like forgetting to reassign a variable or not returning a value from a function that should return a value. As long as it breaks your program but doesn't raise a `SyntaxError`, it's worth trying. Then use the debugger to set a breakpoint, run the code until the breakpoint causes the program to stop, then inspect the values of the various variables you're working with.

The VScode editor offers a really nice alternative to using Chrome. It's a little tricky to get set up, but once you do, it'll be worth the effort. Check out [this video](https://www.youtube.com/watch?v=yFtU6_UaOtA) for a brief tutorial on how to get started. Most other editors have some way to provide Node debugging support, but the VScode UI is one of the best.

## Chrome Developer Tool Debugging Node.js

[short tutorial](https://www.digitalocean.com/community/tutorials/how-to-debug-node-js-with-the-built-in-debugger-and-chrome-devtools#step-3-—-debugging-nodejs-with-chrome-devtools) How To Debug Node.js with the Built-In Debugger and Chrome DevTools

- In Node.js development, tracing a coding error back to its source can save a lot of time over the course of a project. But as a program grows in complexity, it becomes harder and harder to do this efficiently. To solve this problem, developers use tools like a *debugger*, a program that allows developers to inspect their program as it runs. By replaying the code line-by-line and observing how it changes the program’s state, debuggers can provide insight into how a program is running, making it easier to find bugs.
- debuggers provide a systematic way to observe what’s happening in a program, without exposing your program to security threats.
- The key features of debuggers are *watching* objects and adding *breakpoints*. By watching objects, a debugger can help track the changes of a variable as the programmer steps through a program. Breakpoints are markers that a programmer can place in their code to stop the code from continuing beyond points that the developer is investigating.

Step 3 - Debugging Node.js with Chrome DevTools

- Chrome DevTools is a popular choice for debugging Node.js in a web browser. As Node.js uses the same [V8 JavaScript engine](https://v8.dev/) that Chrome uses, the debugging experience is more integrated than with other debuggers.

- For this exercise, we’ll create a new Node.js application that runs an HTTP server and returns a [JSON response](https://www.digitalocean.com/community/tutorials/how-to-work-with-json-in-javascript). We’ll then use the debugger to set up breakpoints and gain deeper insight into what response is being generated for the request.

- Start Chrome debugger with this command

  ```terminal
  $ node --inspect server.js
  ```

- After starting the debugger, you’ll find the following output:

  ```
  OutputDebugger listening on ws://127.0.0.1:9229/996cfbaf-78ca-4ebd-9fd5-893888efe8b3
  For help, see: https://nodejs.org/en/docs/inspector
  Server is running on http://localhost:8000
  ```

Now open Google Chrome or [Chromium](https://www.chromium.org/) and enter `chrome://inspect` in the address bar. [Microsoft Edge](https://www.microsoft.com/en-us/edge) also uses the V8 JavaScript engine, and can thus use the same debugger. If you are using Microsoft Edge, navigate to `edge://inspect`.

After navigating to the URL, you will see the following page:

![Screenshot of Google Chome's "inspect" page](https://assets.digitalocean.com/articles/67203/Chrome_inspect_page.png)

Under the **Devices** header, click the **Open dedicated DevTools for Node** button. A new window will pop up:

![Screenshot of debug window](https://assets.digitalocean.com/articles/67203/debug_window.png)

We’re now able to debug our Node.js code with Chrome. Navigate to the **Sources** tab if not already there. On the left-hand side, expand the file tree and select `server.js`:

![Screenshot of debugger window's Sources tab](https://assets.digitalocean.com/articles/67203/debugger_window_sources_tab.png)

Let’s add a breakpoint to our code. We want to stop when the server has selected a greeting and is about to return it. Click on the line number **10** in the debug console. A red dot will appear next to the number and the right-hand panel will indicate a new breakpoint was added:

![Screenshot of adding a breakpoint in the Chrome debugger](https://assets.digitalocean.com/articles/67203/adding_a_breakpoint.png)

Now let’s add a watch expression. On the right panel, click the arrow next to the **Watch** header to open the watch words list, then click **+**. Enter `greeting` and press `ENTER` so that we can observe its value when processing a request.

Next, let’s debug our code. Open a new browser window and navigate to `http://localhost:8000`—the address the Node.js server is running on. When pressing `ENTER`, we will not immediately get a response. Instead, the debug window will pop up once again. If it does not immediately come into focus, navigate to the debug window to see this:

![Screenshot of the program's execution paused in Chrome](https://assets.digitalocean.com/articles/67203/execution_paused.png)

The debugger pauses the server’s response where we set our breakpoint. The variables that we watch are updated in the right panel and also in the line of code that created it.

Let’s complete the response’s execution by pressing the continue button at the right panel, right above **Paused on breakpoint**. When the response is complete, you will see a successful JSON response in the browser window used to speak with the Node.js server:

```
{"message": "Hello world"}
```

In this way, Chrome DevTools does not require changes to the code to add breakpoints. If you prefer to use graphical applications 

## VS Code Debugging

- debug tab on left
- add configuration
  - n the context of debugging Node.js applications using Visual Studio Code (VS Code), the "Add Configuration" action in the `launch.json` file allows you to quickly generate a configuration for debugging your Node.js application. The `launch.json` file is used to configure how VS Code's debugger interacts with your code during debugging sessions.
- add breakpoints
  - A breakpoint is a designated line in your code where the debugger will pause the execution of your program. When the execution reaches a breakpoint, the debugger will halt the program, allowing you to inspect variables, step through the code line by line, and understand the program's state at that moment.
  - Open your code in your chosen IDE.
  - Navigate to the line where you want to set a breakpoint.
- watch values
  - When debugging, you might want to keep an eye on the values of specific variables as your program runs. The "watch" feature allows you to monitor the values of these variables in real-time, even as the program execution progresses through various lines of code.
- Add configuration: node.js attach --> attaches to a port
  - "restart": "true"
  - allows nodemon to run

![image-20230808140147689](C:\Users\jenny\AppData\Roaming\Typora\typora-user-images\image-20230808140147689.png)

## `npx` vs `npm run`

- `npx` is for running binaries from npm packages, especially when you want to use a package's command without installing it globally or as a project dependency. 

  - ```json
    "scripts": {
      "start": "npx nodemon todos.js", 
      "debug": "node --inspect todos.js"
    },
    ```

  - `nodemon` is a binary executable. It is a command-line tool used to monitor changes in Node.js application's source code files. 

- `npm run` to execute scripts defined in project's `package.json` file. 

- `node` to run js files.

# Display a Single Todo List

Now that we can display a list of todo lists and can add new todo lists to the list, it's time to display individual todo lists. The page should look something like this:



![View Todo Page](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/display-a-single-todo-list-01.png)



This page displays the todo list's title on a line that includes `Complete All` and `Edit List` buttons, then a list of all of the todos in that todo list. The list of todos is sorted in the same way as the lists of todo lists: by completion status and title. Each todo item has a checkbox that indicates the todo's completion status. Completed todos have a checkmark in the box while unchecked todos are still open. The trash can icon deletes a todo entirely. Finally, there's a small data entry form at the bottom of the page where the user can add a new todo to the list. As with new todos, we'll require a title between 1 and 100 characters in length.

## The Pug Template

Let's create the Pug template first. This template is the most ambitious Pug view that we'll use in this course. We don't recommend trying it on your own, but if you're feeling extremely confident, don't let us stop you.

Hide views/list.pug

views/list.pug

```jade
extends layout

block main
  section#todos(class=todoList.isDone() ? "done" : "")
    header
      h2= todoList.title
      ul
        if todoList.size() > 0 && !todoList.isDone()
          li
            form.complete_all(action=`/lists/${todoList.id}/complete_all`
                              method="post")
              button.check(type="submit") Complete All
        li
          form(action=`/lists/${todoList.id}/edit` method="get")
            button.edit(type="submit") Edit List

    ul
      each todo in todos
        li(class=todo.isDone() ? "done" : "")
          form.check(action=`/lists/${todoList.id}/todos/${todo.id}/toggle`
                     method="post")
            input(type="hidden" name="done" value=!todo.isDone())
            button Done

          h3= todo.title
          form.delete(action=`/lists/${todoList.id}/todos/${todo.id}/destroy`
                      method="post")
            button Delete

    form(action=`/lists/${todoList.id}/todos` method="post")
      dl
        dt
          label(for="todoTitle") Enter a new todo item:
        dd
          input(type="text"
                name="todoTitle"
                id="todoTitle"
                placeholder="Something to do"
                value=todoTitle)
      fieldset.actions
        button Add

block headerLinks
  .actions
    a.list(href="/lists") All Lists
```

The general layout of this template should seem familiar by now. However, the content of the `main` block may seem a bit overwhelming. You don't need to understand every line of code here; you don't even need to understand most. However, to give you a feel for what's here, here are the high points:

- Line 4 creates a section with the CSS ID `todos`, which enables the light gray color and the `Complete All` and `Edit List` buttons.
- Line 6 sets the title of the current todo list from its `title` property.
- Lines 7-15 render the `Complete All` and `Edit List` buttons.
- The forms on lines 10 and 14 need the todo list ID as part of the action URL.
- Lines 18-28 iterate over and displays each todo.
- The class on line 19 controls the appearance of each todo based on its completion status.
- The form that begins on line 20 renders the checkbox that toggles todos from undone to done and back again.
- The form that starts on line 26 uses a trashcan icon to delete a todo.
- The form that begins on line 30 lets the user create a new todo item. As with todo lists, we have a required title whose length is limited to 100 characters. However, we won't try to prevent duplicates.
- All of the forms perform an action that requires the ID of the todo list.
- The Edit List form generates a GET request; the other forms issue a POST request.
- Line 44 creates a button in the upper right corner to return the list of all lists.

## Updating the JavaScript Code

Our next task is to write a GET route for `/lists/:todoListId`, where `:todoListId` represents the ID of the todo list we're processing. Thus, a GET request for `/lists/5` would display the todo list with ID `5` (the Home Todos list in our seed data). The route needs to:

- Get the list ID from `req.params.todoListId`.
- Use the todo list ID to retrieve the specified todo list object from `todoLists`.
- The application should issue a `404 Not found.` HTTP status code if no such list exists. (See the Hint.)

Try to do this on your own. When you're ready, you can look at our code.

Hide hint: generating 404 errors

If the requested todo list doesn't exist, the app should raise an error. However, the program itself should never try to access a todo list that doesn't exist: if it does, there's a bug! More likely, somebody is trying to probe the application in an attempt to access something they shouldn't. While it's possible to handle this situation with a flash error, a hard failure may be better. Instead of the flash error, we should issue a `404 Not found` error without providing any details to the user. A legitimate user can't do anything about a bug, and a "black hat" may be able to use any information you provide.

To issue a 404 error, you need an Express error handler.

Since we need to test for valid todo list ids in several routes, set up the error check as a regular function that you can reuse later. You can call the function from each route that needs to load a todo list.

Hide Possible Solution

todos.js

```js
// Add this code just before the `app.listen()` call at the bottom of the file.

// Render individual todo list and its todos
app.get("/lists/:todoListId", (req, res, next) => {
  let todoListId = req.params.todoListId;
  let todoList = loadTodoList(+todoListId);
  if (todoList === undefined) {
    next(new Error("Not found."));
  } else {
    res.render("list", {
      todoList: todoList,
      todos: sortTodos(todoList),
    });
  }
});

// Error handler
app.use((err, req, res, _next) => {
  console.log(err); // Writes more extensive information to the console log
  res.status(404).send(err.message);
});
```

Note that we need a function that loads and returns a todo list by ID number, and one that returns a sorted list of the todos in a todo list.

todos.js

```js
// A good place for this code is just after the `app.use` method calls.

// Find a todo list with the indicated ID. Returns `undefined` if not found.
// Note that `todoListId` must be numeric.
const loadTodoList = todoListId => {
  return todoLists.find(todoList => todoList.id === todoListId);
};
```

todos.js

```js
// Add the following code after the `sortTodoLists` function.

// return the list of todos in the todo list sorted by completion status and
// title.
const sortTodos = todoList => {
  let undone = todoList.todos.filter(todo => !todo.isDone());
  let done   = todoList.todos.filter(todo => todo.isDone());
  undone.sort(compareByTitle);
  done.sort(compareByTitle);
  return [].concat(undone, done);
};
```

Note that both of the sort methods use `compareByTitle`. We should update the parameter names so they don't refer to todo lists anymore:

todos.js

```js
// Compare object titles alphabetically (case insensitive)
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
```

Go ahead and test the program to make sure it works properly. To check the 404 processing, try pointing your browser to something like http://localhost:3000/lists/37109 or any other list ID that is unlikely to exist.

Note that `sortTodos` is very similar to `sortTodoLists`. We're not going to bother to refactor them right now, but we will in a later course. For now, we can be lazy.

## Modularization

Since our sorting functions are closely related, let's pull them out of `todos.js` into a separate module named `sort`:

lib/sort.js

```js
// Compare object titles alphabetically (case-insensitive)
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

module.exports = {
  // return the list of todo lists sorted by completion status and title.
  sortTodoLists(todoLists) {
    let undone = todoLists.filter(todoList => !todoList.isDone());
    let done = todoLists.filter(todoList => todoList.isDone());
    undone.sort(compareByTitle);
    done.sort(compareByTitle);
    return [].concat(undone, done);
  },

  // sort a list of todos
  sortTodos(todoList) {
    let undone = todoList.todos.filter(todo => !todo.isDone());
    let done = todoList.todos.filter(todo => todo.isDone());
    undone.sort(compareByTitle);
    done.sort(compareByTitle);
    return [].concat(undone, done);
  },
};
```

todos.js

```js
// Delete these functions

// const compareByTitle = (itemA, itemB) => {...}
// const sortTodoLists = todoLists => sortItems(...);
// const sortTodos = todoList => sortItems(...);
```

todos.js

```js
const TodoList = require("./lib/todolist");
const { sortTodoLists, sortTodos } = require("./lib/sort");
```

## What's Next?

At this point, the list of todos page shows the list of todos in the proper order, but most of the buttons don't work. Only the `All Lists` button works properly -- it tells the browser to display the list of todo lists.

In the next assignment, we'll add the ability to mark todos as done (or unmark them), delete todos, and complete all of the todos. In subsequent assignments, we'll add the ability to create new todos and to edit the list title.

# Editing Todos

In this assignment, we'll continue working on the page that displays all of the todos in a todo list. We'll add functionality to toggle the completion status of individual todos, delete todos, and to mark all todos on a todo list as done. You'll do most of the work yourself.

## Practice Problem 1: Toggle Todo Completion Status

For this problem, the checkboxes next to each todo on the todo list should be clickable. When you click on an empty box, it should mark that todo as done. Clicking an already-checked checkbox should mark that todo as not done. Your program should exhibit the following behaviors:

- When you click a box, the screen should automatically redraw itself.
- Done todos should have a checkmark in the checkbox; undone todos should not have a checkmark.
- Done todos should be grayed out with a strikethrough; undone todos should display normally.
- When all todo lists are marked done, the todo list title should appear grayed out with a strikethrough.
- When all todo lists are marked done, the `Complete All` button should not be displayed.
- In the list of todo lists at `http://localhost:3000/lists`, the modified todo list should show the new remaining todos counts. When all todos in the list are done, the todo list should show up as done.
- At all times, the todos should be sorted alphabetically with done todos at the bottom.

Most of these actions should occur automatically without any additional code. Once you hook up the checkboxes to respond to clicks and toggle the completion status, the Pug view and CSS should handle the remaining behaviors.

You should also issue a flash success message after toggling a todo's completion status.

Make sure your code issues a 404 status code if either the requested todo list or the specified todo does not exist.

<u>Hide Hint to Determine the Route</u>

If you examine the `list.pug` file, you should see that the checkboxes are implemented as forms that send a POST request to `/lists/${todoList.id}/todos/${todo.id}/toggle`. Thus, you need a POST route that handles paths with this pattern.

<u>Hide Hint to Test 404 Handling</u>

You can use the following commands to test whether the 404 handling works. The first should fail because of an invalid todo list ID, while the second should fail because of the todo ID is invalid. Note, however, that the output won't tell you which ID is invalid.

```terminal
$ curl -i -d done=true -X POST http://localhost:3000/lists/21627/todos/2/toggle
$ curl -i -d done=true -X POST http://localhost:3000/lists/1/todos/21627/toggle
```

- Note: Make sure you are correctly accessing the URL using a `POST` request. Since the route `/lists/:todoListId/todos/:todoId/toggle` is configured to handle `POST` requests, trying to access it directly via a browser URL will result in a "Cannot GET" error. 
  - Instead, you can test this route using a tool like `curl` or by submitting a `POST` request via a form in your application. 
- Note: Need to open a second terminal window to make `curl` commands, since the first one is running the server.

- Test: this one successfully toggles the second todo in list 1.

```terminal
$ curl -i -d done=true -X POST http://localhost:3000/lists/1/todos/2/toggle
```

Hide Possible Solution

todos.js

```js
// Add this code just before the error handler

// Toggle completion status of a todo
app.post("/lists/:todoListId/todos/:todoId/toggle", (req, res, next) => {
  let { todoListId, todoId } = { ...req.params };
  let todo = loadTodo(+todoListId, +todoId);
  if (!todo) {
    next(new Error("Not found."));
  } else {
    let title = todo.title;
    if (todo.isDone()) {
      todo.markUndone();
      req.flash("success", `"${title}" marked as NOT done!`);
    } else {
      todo.markDone();
      req.flash("success", `"${title}" marked done.`);
    }

    res.redirect(`/lists/${todoListId}`);
  }
});
```

todos.js

```js
// Add this code after `loadTodoList`

// Find a todo with the indicated ID in the indicated todo list. Returns
// `undefined` if not found. Note that both `todoListId` and `todoId` must be
// numeric.
const loadTodo = (todoListId, todoId) => {
  let todoList = loadTodoList(todoListId);
  if (!todoList) return undefined;

  return todoList.todos.find(todo => todo.id === todoId);
};
```

## Practice Problem 2: Delete a Todo

For this problem, the trash can icons on the right side of the screen should be clickable. When you click on a trash can, it should remove the todo from the todo list and delete it. Your program should exhibit the following behaviors:

- When you click a trash can, the screen should automatically redraw itself.
- Deleted todos should not appear on the redrawn screen.
- You should be able to delete both done and undone todos.
- When all todo lists are deleted or marked done, the `Complete All` button should not be displayed.
- In the list of todo lists at `http://localhost:3000/lists`, the modified todo list should show the new counts. Once you've deleted all of the undone, the todo list should show up as a done todo list.
- At all times, the todos should remain sorted properly.

Most of these actions occur automatically without any additional code. Once you hook up the trash can icons to respond to clicks and delete todos, the Pug view and CSS should handle the remaining behaviors.

As with Problem 1, make sure your code issues a 404 status code if either the requested todo list or the specified todo does not exist.

You should also issue a flash success message after deleting a todo.

Hide Hint to Determine the Route

If you examine the `list.pug` file, you should see that the trash cans are implemented as forms that send a POST request to `/lists/${todoList.id}/todos/${todo.id}/destroy`. Your code needs a POST route that handles paths with this pattern.

Hide Hint to Test 404 Handling

You can use the following commands to test whether the 404 handling works. The first should fail because of an invalid todo list ID, while the second should fail because of an invalid todo ID. Note, however, that the output won't tell you which ID is invalid.

```terminal
$ curl -i -X POST http://localhost:3000/lists/21627/todos/2/destroy
$ curl -i -X POST http://localhost:3000/lists/1/todos/21627/destroy
```

Hide Hint for Removing Todos

To remove a todo from a todo list, you must pass the `removeAt` method the **index** of the todo that you want to delete. That means that you somehow need to determine that index. The `TodoList` class has a method that should help you do that.

Hide Possible Solution

todos.js

```js
// Add this code just before the error handler

// Delete a todo
app.post("/lists/:todoListId/todos/:todoId/destroy", (req, res, next) => {
  let { todoListId, todoId } = { ...req.params };

  let todoList = loadTodoList(+todoListId);
  if (!todoList) {
    next(new Error("Not found."));
  } else {
    let todo = loadTodo(+todoListId, +todoId);
    if (!todo) {
      next(new Error("Not found."));
    } else {
      todoList.removeAt(todoList.findIndexOf(todo));
      req.flash("success", "The todo has been deleted.");
      res.redirect(`/lists/${todoListId}`);
    }
  }
});
```

## Practice Problem 3: Mark All Todos As Done

In this problem, implement the behavior for the `Complete All` button. Clicking this button marks every todo item on a todo list as done. It is not directly reversible -- you can't unmark all of the todos but must unmark them individually. Your program should exhibit the following behaviors:

- When you click `Complete All`, the screen should automatically redraw itself.
- All todos should be marked as done, and use the proper display styles used elsewhere.
- The todo list title should appear grayed out with a strikethrough.
- In the list of todo lists at `http://localhost:3000/lists`, the modified todo list should show the new counts. The todo list should also show up as a done todo list.
- The `Complete All` button should not be displayed.

Most of these actions occur automatically without any additional code. Once you hook up the `Complete All` button to respond to clicks and mark the todos as done, the Pug view and CSS should handle the remaining behaviors.

You should also issue a flash success message after marking everything done.

Make sure your code issues a 404 status code if the requested todo list does not exist.

Hide Hint to Determine the Route

If you examine the `list.pug` file, you should see that `Complete All` is implemented as a form that sends a POST request to `/lists/${todoList.id}/complete_all`. Your code needs a POST route that handles paths with this pattern.

Hide Possible Solution

todos.js

```js
// Add this code just before the error handler

// Mark all todos as done
app.post("/lists/:todoListId/complete_all", (req, res, next) => {
  let todoListId = req.params.todoListId;
  let todoList = loadTodoList(+todoListId);
  if (!todoList) {
    next(new Error("Not found."));
  } else {
    todoList.markAllDone();
    req.flash("success", "All todos have been marked as done.");
    res.redirect(`/lists/${todoListId}`);
  }
});
```

## Coming Up

In the next assignment, we'll finish working on this page and add the ability to create new todos. However, we won't hook up the `Edit List` button yet; we'll do that a little later.

# Creating New Todos

Phew! We've come a long way, but there's still more to do.

In this assignment, we'll add the functionality to create new todo items. The form for new todo items is at the bottom of the page we've worked on in the last two assignments. It consists of a single field where the user can enter a new todo's title. Again, you'll do most of the work yourself, with fewer hints.

## Practice Problem: Create a New Todo

For this problem, the text input field at the bottom of the page provides an area where the user can enter the title of a new todo item. The todo gets created and then added to the current todo list when you submit the form. Your program should exhibit the following behaviors:

- When you submit the form, the screen should automatically redraw itself.
- If you enter a valid title for the new todo, the new todo should appear in the list of todos, sorted appropriately. The new todo should **not** be marked as done.
- The todo title is required; issue an appropriate flash error message if the title is unspecified.
- The todo title has a maximum size of 100 characters; display an appropriate flash error when the title is too long. Make sure the invalid title doesn't disappear when the page is redrawn.
- Duplicate todo titles are **allowed**.
- In the list of todo lists at `http://localhost:3000/lists`, the modified todo list should show the new counts.
- At all times, the todos should be sorted alphabetically with done todos at the bottom of the list.

Most of these actions occur automatically without any additional code. Once you hook up the form to respond to a submission, create a new todo, and add it to the todo list, the Pug view and CSS should handle the remaining behaviors.

You should also issue a flash success message after creating a new todo.

Make sure your code issues a 404 status code if the requested todo list does not exist.

<u>Note</u>

- Both links and buttons are action triggers in web development.
- Here, once we set up a route in our application, the button will trigger the form submission process. 
- We need to determine the placeholders needed to render the "list" view.

Hide Possible Solution

todos.js

```js
const TodoList = require("./lib/todolist");
const Todo = require("./lib/todo");
```

todos.js

```js
// Add this code just before the error handler

// Create a new todo and add it to the specified list
app.post("/lists/:todoListId/todos",
  [
    body("todoTitle")
      .trim()
      .isLength({ min: 1 })
      .withMessage("The todo title is required.")
      .isLength({ max: 100 })
      .withMessage("Todo title must be between 1 and 100 characters."),
  ],
  (req, res, next) => {
    let todoListId = req.params.todoListId;
    let todoList = loadTodoList(+todoListId);
    if (!todoList) {
      next(new Error("Not found."));
    } else {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach(message => req.flash("error", message.msg));

        res.render("list", {
          flash: req.flash(),
          todoList: todoList,
          todos: sortTodos(todoList),
          todoTitle: req.body.todoTitle,
        });
      } else {
        let todo = new Todo(req.body.todoTitle);
        todoList.add(todo);
        req.flash("success", "The todo has been created.");
        res.redirect(`/lists/${todoListId}`);
      }
    }
  }
);
```

with my pseudocode

```js
// Create a new todo and add it to the specified list.
app.post("/lists/:todoListId/todos",
  [
    body("todoTitle")
      .trim()
      .isLength({ min: 1 })
      .withMessage("The title must be at least 1 character long.")
      .isLength({ max: 100 })
      .withMessage("The title must be between 1 and 100 characters")
  ],
  (req, res, next) => {
    // step 1: check if the todoList is valid
    let todoListId = req.params.todoListId;
    let todoList = loadTodoList(+todoListId);
    if (!todoList) {
      next(new Error("Not Found."));
    } else {
      // Check if there were errors
      let errors = validationResult(req);
      // If there are errors, render list view with the error flash messages
      if (!errors.isEmpty()) {
        errors.array().forEach(message => req.flash("error", message.msg));
        res.render("/list", {
          flash: req.flash(),
          todoList: todoList,
          todos: sortTodos(todoList), // sortTodos returns an array of sorted todos.
          todoTitle: req.body.todoTitle // get HTTP post input values from req.body
        });
      } else { // if there aren't errors, render a new list page with new todo
        let todo = new Todo(req.body.todoTitle); // we imported Todo, use the constructor to create new todo object.
        todoList.add(todo);
        req.flash("Success", "The todo has been created.");
        res.redirect(`/lists/${todoListId}`); //redirect to render the lists view.
      }
    }
  }
);
```



Note: the code we use to invoke the validation chain is nearly identical to that used in the route that creates new lists:

```js
(req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(message => req.flash("error", message.msg));

    // omitted code: do something here to re-render the page
  } else {
    // omitted code: do something here to update the data
  }
},
```

The sole difference is that the code for re-rendering the page differs for each route. The repetitive code suggests a possible refactoring. However, we're not going to try that here. It's a somewhat tricky refactoring that involves sending a callback function to a function that returns a middleware. That's a bit more than we want to get into right now, and it'll make it harder to reason about when we revisit this application in a later course.

# Editing a Todo List

The final item on the `list` view is the `Edit List` button. For that, we need a new view that lets us modify the todo list title or delete the todo list entirely:



![Todo list editing page](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/editing-a-todo-list-01.png)



## Practice Problem 1: Create the `edit-list` View

Our view needs to display the editing page shown above. Note that it displays the current list title at the top of the page and as the initial value in the new title input area. If the user enters an invalid title, the page should show the original title at the top and the user's input in the input area.

Call the new view `edit-list.pug`. If you think you understand Pug well enough, feel free to try it yourself. Otherwise, you can copy and paste the code from the solution.

Here are some notes for the do-it-yourselfers:

- The "Delete List" button should invoke a POST request to `/lists/${todoList.id}/destroy`.
- The form for updating the list title should invoke a POST request to `/lists/${todoList.id}/edit`.
- Use `section#todos` as the container for the line that shows `Edit 'todo-list-title'` and the `Delete List` button.
- Use a `form` as the container for everything below the `section#todos` line.
- The input field for the new list title needs to show the user's most recent input if an error occurred. Otherwise, it needs to show the current form title.

Note that you don't need to create any routes right now; we'll do that a little later.

Hide Possible Solution

views/edit-list.pug

```jade
extends layout

block main
  section#todos
    header
      h2 Editing '#{todoList.title}'
      ul
        li
          form.delete(action=`/lists/${todoList.id}/destroy` method="post")
            button.delete(type="submit") Delete List

  form(action=`/lists/${todoList.id}/edit` method="post")
    dl
      dt
        label(for="todoListTitle") Enter the new title for the list:
      dd
        input(type="text"
              name="todoListTitle"
              placeholder="List Title"
              value=todoListTitle || todoList.title)
    fieldset.actions
      input(type="submit" value="Save")
      a(href=`/lists/${todoList.id}`) Cancel
```

This template follows much the same pattern as other Pug templates that we've built. The main difference is the `value` tag for the `todoListTitle` input field, which is defined as `todoListTitle || todoList.title`. 

<u>Conventional way to pre-fill fields</u>

When an error occurs, we pass the input list title via the second argument to `res.render`, which lets Pug access it as `todoListTitle`. However, if `todoListTitle` is undefined, we can use the list's current title, which we can access with `todoList.title`. This technique is the conventional way to pre-fill fields when editing.

## Practice Problem 2: Display the Edit Todo List Page

If you study `list.pug`, you should see that the `Edit List` button sends a GET request to `/lists/${todoList.id}/edit`. Go ahead and create a route that handles that path. It should render the `edit-list` view. Don't forget to ensure that the todo list exists; issue a 404 error if it does not.

Possible Solution

todos.js

```js
// Add this code just before the error handler

// Render edit todo list form
app.get("/lists/:todoListId/edit", (req, res, next) => {
  let todoListId = req.params.todoListId;
  let todoList = loadTodoList(+todoListId);
  if (!todoList) {
    next(new Error("Not found."));
  } else {
    res.render("edit-list", { todoList });
  }
});
```

## Practice Problem 3: Delete the Todo List

Create a route that gets control when the user clicks the `Delete List` button. After deleting the todo list, the route should redirect back to the list of todo lists. The list of todo lists should show a success message. Don't forget to verify that the todo list exists and issue a 404 error if it does not.

Possible Solution

todos.js

```js
// Add this code just before the error handler

// Delete todo list
app.post("/lists/:todoListId/destroy", (req, res, next) => {
  let todoListId = +req.params.todoListId;
  let index = todoLists.findIndex(todoList => todoList.id === todoListId);
  if (index === -1) {
    next(new Error("Not found."));
  } else {
    todoLists.splice(index, 1);

    req.flash("success", "Todo list deleted.");
    res.redirect("/lists");
  }
});
```

My solution

```js
// Delete todo list
app.post("/lists/:todoListId/destroy", (req, res, next) => {
  let todoListId = req.params.todoListId;
  let todoList = loadTodoList(+todoListId);
  if (!todoList) {   // verify todo list exists
    next(new Error("Not Found."));
  } else {
    let index = todoLists.findIndex(todoList => todoList.id === todoListId);
    todoLists.splice(index, 1);
    req.flash("success", "Todo list deleted."); // success flash message
    res.redirect("/lists"); // redirect back to the main page(list of todo lists)
  }
});
```

Make sure that you used `res.redirect` to send the browser back to the main page.

## Practice Problem 4: Edit the Todo List Title

Create a route that gets control when the user submits the form at the bottom of the `edit-list` view. 

- If the title is present and between 1 and 100 characters in length, the route should update the todo list and send the browser back to the `list` view for the todo list with an appropriate success message. 
- Otherwise, it should redisplay the `edit-list` view with a flash error message. The title has the same requirements that we applied when creating new todo lists. 
- Don't forget to verify that the todo list exists and issue a 404 error if it does not.

The page should show the user's previous input in the input field when handling an error unless an empty list title caused that error. Otherwise, it should show the current list title.

- Pass `req.body.todoListTitle` to `res.render()` for the block with validation errors, and it will show the user's previous input in the input field. For the block that passed with no validation errors, set the new title using `req.body.todoListTitle`. 

Possible Solution

todos.js

```js
// Add this code just before the error handler

// Edit todo list title
app.post("/lists/:todoListId/edit",
  [
    body("todoListTitle")
      .trim()
      .isLength({ min: 1 })
      .withMessage("The list title is required.")
      .isLength({ max: 100 })
      .withMessage("List title must be between 1 and 100 characters.")
      .custom(title => {
        let duplicate = todoLists.find(list => list.title === title);
        return duplicate === undefined;
      })
      .withMessage("List title must be unique."),
  ],
  (req, res, next) => {
    let todoListId = req.params.todoListId;
    let todoList = loadTodoList(+todoListId);
    if (!todoList) {
      next(new Error("Not found."));
    } else {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach(message => req.flash("error", message.msg));

        res.render("edit-list", {
          flash: req.flash(),
          todoListTitle: req.body.todoListTitle,
          todoList: todoList,
        });
      } else {
        todoList.setTitle(req.body.todoListTitle);
        req.flash("success", "Todo list updated.");
        res.redirect(`/lists/${todoListId}`);
      }
    }
  }
);
```

Make sure that you used `res.redirect` to send the browser back to the page that shows the current todo list.

The validation chain for `app.post("/lists/:todoListId/edit")` is identical to that used by `app.post("/lists")`, so we should be able to refactor it. However, we're not going to try that here. It's a somewhat tricky refactoring that involves defining an asynchronous middleware that invokes the validation chain. That's a bit more than we want to get into right now. It would also make it harder to reason about when we revisit this application in a later course.

## What's Next

Functionality-wise, our todo list manager is mostly complete. Now should be a good time to make the data persistent. We'll do that next.

# Session Persistence

As you've no doubt noticed by now, our todo list manager has a significant problem: the data isn't persistent. Each time we restart the application, whether manually or with `nodemon`, the app loses any changes we made to the todo list. In this assignment, we'll use `connect-loki` to provide a persistent session store for our application. We'll use that store to provide persistent data for each user.

## Install connect-loki

As we learned in the previous lesson, `connect-loki` lets `express-session` use a NoSQL database as the session data store. Go ahead and install it now.

Hide Command

```terminal
$ npm install connect-loki --save
```

Please see the previous lesson if you need a refresher on `connect-loki`.

Don't forget to treat the `session-store.db` file as sensitive data. You should add it to your `.gitignore` file before pushing it to Github.

.gitignore

```git
# Existing entries, if any, omitted

session-store.db
```

## Preparing the Session Data Store

The next step in enabling a persistent data store for our todo list manager is to tell `express-session` to use `connect-loki` as the store. We also need to configure our session cookie:

todos.js

```js
const express = require("express");
const morgan = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const { body, validationResult } = require("express-validator");
const TodoList = require("./lib/todolist");
const Todo = require("./lib/todo");
const { sortTodoLists, sortTodos } = require("./lib/sort");
const store = require("connect-loki");

const app = express();
const host = "localhost";
const port = 3000;
const LokiStore = store(session);
```

todos.js

```js
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in millseconds
    path: "/",
    secure: false,
  },
  name: "launch-school-todos-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "this is not very secure",
  store: new LokiStore({}),
}));
```

There's nothing in that code that we haven't seen before.

## Moving the Data to the Session Store

Before we move the data to the session store, let's discard the seed data we used to initialize the list of todo lists. In a real-world application, we wouldn't use seed data for a production application, but would instead load data from a database. At this point, we no longer need the seed data, so we may as well eliminate it.

todos.js

```js
// Delete the following code:

// // Static data for initial testing
// let todoLists = require("./lib/seed-data");
```

Since we no longer have the `todoLists` variable, we need to define a new one. A good place for it is in the `req.session` object so that `express-session` and `connect-loki` can keep track of things. For each request, we can read the data from the session store. If a session store for the current user and client doesn't exist, we can create a new, empty store:

todos.js

```js
app.use(flash());

// Set up persistent session data
app.use((req, res, next) => {
  if (!("todoLists" in req.session)) {
    req.session.todoLists = [];
  }

  next();
});
```

Next, we need to change all remaining references to `todoLists` elsewhere to `req.session.todoLists`. In the case of `loadTodoList`, we need to pass a `todoLists` argument into the function. There are many changes, but they're consistent:

Hide Possible Solution

todos.js

```js
// Find a todo list with the indicated ID. Returns `undefined` if not found.
// Note that `todoListId` must be numeric.
const loadTodoList = (todoListId, todoLists) => {
  return todoLists.find(todoList => todoList.id === todoListId);
};

// Find a todo with the indicated ID in the indicated todo list. Returns
// `undefined` if not found. Note that both `todoListId` and `todoId` must be
// numeric.
const loadTodo = (todoListId, todoId, todoLists) => {
  let todoList = loadTodoList(todoListId, todoLists);
  if (!todoList) return undefined;

  return todoList.todos.find(todo => todo.id === todoId);
};
```

todos.js

```js
// Render the list of todo lists
app.get("/lists", (req, res) => {
  res.render("lists", {
    todoLists: sortTodoLists(req.session.todoLists),
  });
});
```

todos.js

```js
// Create a new todo list
app.post("/lists",
  [
    body("todoListTitle")
      .trim()
      .isLength({ min: 1 })
      .withMessage("The list title is required.")
      .isLength({ max: 100 })
      .withMessage("List title must be between 1 and 100 characters.")
      .custom((title, { req }) => {
        let todoLists = req.session.todoLists;
        let duplicate = todoLists.find(list => list.title === title);
        return duplicate === undefined;
      })
      .withMessage("List title must be unique."),
  ],
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(message => req.flash("error", message.msg));
      res.render("new-list", {
        flash: req.flash(),
        todoListTitle: req.body.todoListTitle,
      });
    } else {
      req.session.todoLists.push(new TodoList(req.body.todoListTitle));
      req.flash("success", "The todo list has been created.");
      res.redirect("/lists");
    }
  }
);
```

todos.js

```js
// Render individual todo list and its todos
app.get("/lists/:todoListId", (req, res, next) => {
  let todoListId = req.params.todoListId;
  let todoList = loadTodoList(+todoListId, req.session.todoLists);
  if (todoList === undefined) {
    next(new Error("Not found."));
  } else {
    res.render("list", {
      todoList: todoList,
      todos: sortTodos(todoList),
    });
  }
});
```

todos.js

```js
// Toggle completion status of a todo
app.post("/lists/:todoListId/todos/:todoId/toggle", (req, res, next) => {
  let { todoListId, todoId } = { ...req.params };
  let todo = loadTodo(+todoListId, +todoId, req.session.todoLists);
  if (!todo) {
    next(new Error("Not found."));
  } else {
    let title = todo.title;
    if (todo.isDone()) {
      todo.markUndone();
      req.flash("success", `"${title}" marked as NOT done!`);
    } else {
      todo.markDone();
      req.flash("success", `"${title}" marked done.`);
    }

    res.redirect(`/lists/${todoListId}`);
  }
});
```

todos.js

```js
// Delete a todo
app.post("/lists/:todoListId/todos/:todoId/destroy", (req, res, next) => {
  let { todoListId, todoId } = { ...req.params };
  let todoList = loadTodoList(+todoListId, req.session.todoLists);
  if (!todoList) {
    next(new Error("Not found."));
  } else {
    let todo = loadTodo(+todoListId, +todoId, req.session.todoLists);
    if (!todo) {
      next(new Error("Not found."));
    } else {
      todoList.removeAt(todoList.findIndexOf(todo));
      req.flash("success", "The todo has been deleted.");
      res.redirect(`/lists/${todoListId}`);
    }
  }
});
```

todos.js

```js
// Mark all todos as done
app.post("/lists/:todoListId/complete_all", (req, res, next) => {
  let todoListId = req.params.todoListId;
  let todoList = loadTodoList(+todoListId, req.session.todoLists);
  if (!todoList) {
    next(new Error("Not found."));
  } else {
    todoList.markAllDone();
    req.flash("success", "All todos have been marked as done.");
    res.redirect(`/lists/${todoListId}`);
  }
});
```

todos.js

```js
// Create a new todo and add it to the specified list
app.post("/lists/:todoListId/todos",
  [
    // omitted code
  ],
  (req, res, next) => {
    let todoListId = req.params.todoListId;
    let todoList = loadTodoList(+todoListId, req.session.todoLists);
    if (!todoList) {
      next(new Error("Not found."));
    } else {
      // omitted code
    }
  }
);
```

todos.js

```js
// Render edit todo list form
app.get("/lists/:todoListId/edit", (req, res, next) => {
  let todoListId = req.params.todoListId;
  let todoList = loadTodoList(+todoListId, req.session.todoLists);
  if (!todoList) {
    next(new Error("Not found."));
  } else {
    res.render("edit-list", { todoList });
  }
});
```

todos.js

```js
// Delete todo list
app.post("/lists/:todoListId/destroy", (req, res, next) => {
  let todoLists = req.session.todoLists;
  let todoListId = +req.params.todoListId;
  let index = todoLists.findIndex(todoList => todoList.id === todoListId);
  if (index === -1) {
    next(new Error("Not found."));
  } else {
    todoLists.splice(index, 1);

    req.flash("success", "Todo list deleted.");
    res.redirect("/lists");
  }
});
```

todos.js

```js
// Edit todo list title
app.post("/lists/:todoListId/edit",
  [
    body("todoListTitle")
      .trim()
      .isLength({ min: 1 })
      .withMessage("The list title is required.")
      .isLength({ max: 100 })
      .withMessage("List title must be between 1 and 100 characters.")
      .custom((title, { req }) => {
        let todoLists = req.session.todoLists;
        let duplicate = todoLists.find(list => list.title === title);
        return duplicate === undefined;
      })
      .withMessage("List title must be unique."),
  ],
  (req, res, next) => {
    let todoListId = req.params.todoListId;
    let todoList = loadTodoList(+todoListId, req.session.todoLists);
    if (!todoList) {
      next(new Error("Not found."));
    } else {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach(message => req.flash("error", message.msg));

        res.render("edit-list", {
          flash: req.flash(),
          todoListTitle: req.body.todoListTitle,
          todoList: todoList,
        });
      } else {
        todoList.setTitle(req.body.todoListTitle);
        req.flash("success", "Todo list updated.");
        res.redirect(`/lists/${todoListId}`);
      }
    }
  }
);
```

The one item worth mentioning here is that the `custom` validators need access to the `req` object so that they can access `req.session.todoLists`. Fortunately, `express-validator` passes the `req` object as a property on its second argument. We can use it most easily by using object destructuring in the parameter list, e.g., `{ req }`.

However, does it work? If you run the program now, it should work. However, if it doesn't, delete the `session-store.db` file and restart the server. That should be enough to get things working.

Once it's working, restart the server again and try again. This time, you should get an error:

```plaintext
todoList.isDone is not a function
```

The problem here is that our app now loads our data from the session store. Unfortunately, the session store doesn't retain prototype information, just **raw** data. That is, the todo lists in our list of todo lists no longer have any methods, nor do the todo objects in each todo list. If we want to call methods on these objects, we need to use the data to build some new `TodoList` and `Todo` objects.

To begin, we can create a static method in the `Todo` module that recreates `Todo` objects from raw data:

lib/todo.js

```js
class Todo {
  // omitted code

  static makeTodo(rawTodo) {
    return Object.assign(new Todo(), rawTodo);
  }
}
```

This code first creates a new `Todo` object, then sets its data properties to the values of the corresponding properties from the `rawTodo` object. Note that `makeTodo` is a static method, so we must call it as `Todo.makeTodo()`.

We can do something similar with the TodoList object, though we need to do a bit more work:

lib/todolist.js

```js
class TodoList {
  // omitted code

  static makeTodoList(rawTodoList) {
    let todoList = Object.assign(new TodoList(), {
      id: rawTodoList.id,
      title: rawTodoList.title,
    });

    rawTodoList.todos.forEach(todo => todoList.add(Todo.makeTodo(todo)));
    return todoList;
  }
}
```

The main thing to note with this code is that we need to add the `Todo` items to the new `TodoList` one at a time by using the `add` method. If we tried to use `Object.assign` instead, it would initialize the `todos` array with raw data, not an array of `Todo` objects.

Let's return to the middleware we used to initialize the list of todo lists. We can call `TodoList.makeTodoList` from this middleware to rebuild the list when we get it from the session store:

todos.js

```js
// Set up persistent session data
app.use((req, res, next) => {
  let todoLists = [];
  if ("todoLists" in req.session) {
    req.session.todoLists.forEach(todoList => {
      todoLists.push(TodoList.makeTodoList(todoList));
    });
  }

  req.session.todoLists = todoLists;
  next();
});
```

At this point, the Todo List Manager should work with persistent data. If you restart the application, it won't lose your data. However, if you open the app in a different browser, you'll be treated as a separate user: you can keep two completely independent lists.

## Clearing Cookies

If you want to wipe out all your todo data and start over, you can delete your session cookie for the Todo List Manager. We'll assume that you're using Google Chrome; the procedure is similar, but different, for other browsers:

1. Go to [http://localhost:3000](http://localhost:3000/). Ignore the error message if one occurs.

2. Open the developer tools: View, Developer, Developer Tools.

3. Click on the Application tab.

4. On the left-hand side, open the Cookies item in the Storage group. You should see something like this:

    

   ![Cookies in the Chrome developer tools](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/session-persistence-01.png)

5. If the right-hand side shows a cookie named `launch-school-todo-session-id` cookie, select it and delete it (use your Backspace or Delete key after selecting the cookie).

The next time you go to [http://localhost:3000](http://localhost:3000/) after deleting the cookie, you should get an empty list.

## What's Next

The todo application is almost complete. However, you may have noticed that we don't ask the user to confirm "dangerous" operations. For instance, the user can mark all todos on a list as done or delete it entirely without having to confirm the action. We'll use a bit of client-side JavaScript in the next assignment to confirm those types of operations.

# Confirmation Dialogs

The application currently supports some operations that may be *dangerous*; they irreversibly delete data or make a global change of some kind. For instance, we can delete todos and todo lists, both of which are irreversible. We can also make a global change to a todo list by marking all of its todos as complete. Furthermore, these actions involve just a single click on the page. Such operations may need user confirmation before completing them.

Our definition of dangerous operations -- permanent deletion or a global change -- isn't a firm rule that you need to apply to every application. Sometimes, you don't want to get in the user's way with constant interruptions to the workflow. The potential data loss may also be an insignificant issue. At other times, however, you want to confirm nearly every change, no matter how trivial. Whether and when you require confirmation is your call -- or at least the requirements with which you're working. From that standpoint, we should confirm deletions and changes to multiple items.

Let's see how we can add a confirmation dialog to our application.

## JavaScript in the Browser

Thus far, in the curriculum, you've only seen JavaScript working as a Node program. However, it got its start as a language that executes code inside your browser. Our application currently runs in the browser. However, all the JavaScript in our app, including that used by Express and Pug, runs on the server. The browser never sees that code. That's about to change: we're going to run some code in the browser. We're not going to learn a lot about how to use JavaScript in the browser: we've got an entire course later in the curriculum that covers JavaScript in the browser. However, we need to know just a bit to display a confirmation dialog to the user.

For the most part, all browsers can run the same JavaScript code. However, each browser supports a developer tools application that lets you work with JavaScript. In particular, it provides a console where you can test out code and see what gets returned or logged to the console, which is what we're interested in now. Since these developer tools differ from browser to browser (and even within different versions of the same browser), you may want to use Google Chrome for the following brief demonstration.

To access the developer tools for Chrome on a Mac, select the View menu in Chrome, then Developer, and finally Developer Tools. Chrome on a Mac or Linux machine may be slightly different. Depending on your configuration, you may get a new window with the tools, or a split pane in the current browser window. Either way, select the Console tab to access the area where you can type in JavaScript code and see the results. The console is sometimes called the browser's JavaScript REPL.

If your Developer Tools opened in a separate window, make sure you can see both the tools window and the main browser window.

The main thing we want to see right now is how the `confirm` function works. In the Console tab, type the following at the `>` prompt:

```node
> confirm("Do you want to continue?");
```

You should now see a dialog that looks something like this:



![Confirmation dialog](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/confirmation-dialogs-01.png)



If you click the `OK` button, you should see the return value, `true`, in the console panel/window:



![Clicking OK](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_6/confirmation-dialogs-02.png)



Similarly, the `Cancel` button causes `confirm` to return `false`.

That's all you need to know about the `confirm` dialog and using the browser to try code.

## Adding JavaScript to A Web Page

Adding JavaScript to a web page is relatively simple. All you need to do is write the JavaScript, save it to a file, and then tell the browser to load the JavaScript.

The `javascripts` directory in your project's `public` folder is the best place to put the JavaScript you want to run on the browser. Like the stylesheets and images in the `public` folder, this JavaScript is an asset that the browser needs to retrieve. Go ahead and create the directory and file:

```terminal
$ mkdir public/javascripts
$ touch public/javascripts/application.js
```

Now, put the following code the JavaScript file:

public/javascripts/application.js

```js
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  let forms = document.querySelectorAll("form.delete, form.complete_all");
  forms.forEach(form => {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (confirm("Are you sure? This cannot be undone!")) {
        event.target.submit();
      }
    });
  });
});
```

Don't worry about the details over how that code works -- you'll learn more than you want to know in a later course. For the moment, here's a brief description of what it does:

- It waits until the DOM (the Document Object Model) has fully loaded. Think of the DOM as the complete page.
- Once the DOM is loaded, it finds all of the forms with a class of either `delete` or `complete_all`. These forms contain the delete controls for todos and todo lists as well as the `Complete All` button.
- It attaches an "event listener" to each of the found forms. The event listener waits until that form is submitted.
- When a form is submitted, the event listener displays the confirmation dialog and waits for the user to click OK or Cancel.
- If the user clicks OK, the event listener submits the form again and lets it run to completion. Otherwise, the listener cancels the rest of the operation.

Finally, we need to load that JavaScript in our application. The best place to do that is in the `layout.pug` file so that it's always available.

views/layout.pug

```jade
head
  title Todo App
  meta(charset="UTF-8")
  link(rel="stylesheet" href="//fonts.googleapis.com/css?family=PT+Sans")
  link(rel="stylesheet" href="/stylesheets/whitespace-reset.css")
  link(rel="stylesheet" href="/stylesheets/application.css")
  script(src="/javascripts/application.js")
```

That's it! Your application should now display a helpful confirmation dialog when you try to delete something or complete all of the todos on a list.

## Summary

That's it. We've finished implementing all of the functionality for our Todo List application. There's a lot we can still do, such as requiring a login name and password to use the app. We'll add some more functionality in a later course.

You can download the final project code [here](https://da77jsbdz4r05.cloudfront.net/zips/js175/todos-final.zip).

# Information about the Back-End Assessment

Course JS189 is an assessment course that covers both JS175 and JS185. The assessment is in two parts -- a project and and interview.

- First, you will create an Express application with Pug templates and a PostgreSQL database. The project is relatively free-form in that you can implement any application you want. However, there are a number of requirements that the project must meet. Those requirements also limit the scope of your project, so it is not completely free-form. If you want, you can write CSS for your project, but the appearance of your project is not important.
- Once you have completed the project assessment, you will schedule an interview assessment. In the interview, you will be asked to answer questions on the concepts from JS175 and JS185 and provide example code in some cases. You will also be asked to talk about your project.

For practice, we recommend creating 2 or 3 practice projects -- see the next assignment for some project ideas.

- [Courses](https://launchschool.com/course_catalog)
- [JS175 Networked Applications with JavaScript](https://launchschool.com/courses/6ae6f2a4)
- [Todo App](https://launchschool.com/lessons/778bd44c)
- 18. Project Ideas

Give us your feedback

# Project Ideas

We covered a great deal of material in the last two lessons, but you may not feel like you've mastered working with Express and Pug. That's okay: we don't expect you to fully master them, yet. However, you'll get more practice once you've learned a bit about working with databases and SQL in an upcoming course. Furthermore, working on the optional projects at the end of this course will help sharpen your skills. These concepts will become important in Capstone and probably in your future job.

In the meantime, you might want to work on one or two small Express + Pug applications on your own. Doing that should help solidify your understanding of the concepts we've covered in this course. Here are some ideas for what you could build:

- Extend the contact list application we worked on in the previous lesson to add more features, assign contacts to categories (e.g., friends, family, work).
- A flight-tracking application that lets a user enter the airline, flight number, destination, and departure time for a flight.
- A monthly budget application that tracks bills, categories or expenses, and provides totals by month or year.
- An application that tracks team names and members, for sports or other activities.
- A survey application that asks a set of questions and persists the answers for display in a report.
- A simple version of any site that you use often
- An online version of one of the games we wrote in JS101 and JS120

Some things to think about while you work:

- Add validations to validate values submitted via forms.
- User inputs should be persistent in the face of simple errors.
- Keep shared content in a layout.
- Keep it simple at first. Add more complex features only when the simpler features work.
- Use `express-flash` and `express-validator` as needed. You can explore using other modules related to Express if you want, but focus on learning the fundamentals instead. Before we showed you how to use `express-flash` and `express-validator`, we wrote and used custom message and validation handlers.
- If appropriate, make each user's data persistent.

We can’t provide code reviews for these projects, but you can post your solutions for other students to see in the [Show and Tell forum](https://launchschool.com/forum?tab=Show+and+Tell). Don't install these applications on the Web if they require any security features, such as passwords or sensitive data. However, you can make them available for download via a Git Repo.

Be sure to include your `package.json` and `package-lock.json` files in the repo. Make sure you don't use the `--global` option. If you install modules globally, they won't appear in `package.json` or `package-lock.json`.

High-quality documentation for Express and Pug is a bit hard to come by. Don't be ashamed to use Google to find tutorials, demonstrations, explanations, and other information that may help you overcome a problem.