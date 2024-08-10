Important Topics You Need to Study:

- Writing Express.js applications
- Writing Pug code
- Using view variables and helpers
- Using and writing routes
- Sessions and persistence
- Using SQL
- Optimizing SQL queries
- Validation and Flash messages
- Using static assets
- Working with the request/response cycle
- Know how and when to use GET and POST requests correctly
- Using redirects properly
- Maintaining state
- Understand and know how to mitigate security risks that can affect HTTP and SQL

# What is a networked application

- Definition 1 : a networked application is *any* application that uses a network connection in some way, mainly to transfer data between one point and another. (such as a client and a server).
  - In this sense, a web server that serves static files such as an HTTP server that we had previously built in the last course could be described as a network application.  
-  Definition 2 (narrower sense):  is that networked applications provide some sort of service to individual end-users, so that different users accessing the application will receive data or content that is tailored specifically to them.
  - An example is online banking, where each user only has access to their own specific account and is only able to assess data or make transactions in relation to that account.
  - Another example is an online shop such as Amazon, where users have access to the same content but can interact with it on an individual basis such as using different search filters or adding different items to their shopping carts.
- The underlying mechanism that enables the narrower definition of networked applications is the processing that occurs on the server according to some sort of pre-defined application logic. 
  - In terms of the HTTP request-response cycle, we can think of the response body from such networked applications as being *dynamically* generated in contrast to the *static* HTML files served by our simple HTTP server. 

# Static Content vs Dynamic Content

During the [previous course](https://launchschool.com/lessons/cc97deb5/assignments/586769d9) we discussed how a server, in the context of a client-server exchange, can often consist of a number of different components. What these components are, and how they are configured, will depend on what you need your server to do; and that in turn generally depends on whether you are serving static or dynamic content.

## Static Content

What is static content

- Static content is where file are pre-created and then uploaded to the server. 
- Once the files are on the server, they are simply stored there as they wait to be served in response to an HTTP request which requires that file. When the server receives a request, the server "serves" the file to to the client. 

Examples

- In the previous course we built a simple HTTP server that served HTML files in response requests for a specific file. Thus, a request for `http://localhost:2345/lion.html` would return the contents of the `lion.html` file (HTML markup) as the body of the HTTP response, and the browser would then render that HTML markup in its viewport as a web page.

- Regardless of how many times we request the file, or who requests the file, the HTML doesn't change and so the web page rendered by the browser is always the same. The only way the HTML would change is if we manually edited it, for example in a text editor, and then uploaded the edited HTML file to the server to over-write the existing file. This is an example of static content.

- Static content doesn't just have to be HTML, but can also be comprised of CSS and JavaScript, which are usually stored in separate files on the server. Static content can also be things like images and videos which get embedded in a webpage, or other types of files that can be stored on a server to be accessed or downloaded.

Static doesn't mean not interactive 

- By static content we also don't mean that the web page itself can't have interactive or animated elements. We can use JavaScript or CSS to provide interaction or animation, in response to a user action for example. 
- The interactive or animated behavior, however, all occurs in the *browser*; that is to say, on the client side. The HTML, CSS, JavaScript, and other files that exist on the server, are always the same.

Serving static content

- To serve static content, only a couple of components are required on the server side: a HTTP server, which receives incoming requests and issues responses; and some sort of public directory within the file system in which to store the static files. 
- A visualization of what is involved in serving static content might look something like the diagram below.

![Simple diagram showing HTTP request for a static html file being responded to by that file being served from the file directory where it is stored](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_1/introduction-static-vs-dynamic-static-content-diagram.png)

Let's break down what's happening in this diagram:

1. The browser (client) makes a request for a file, e.g. `lion.html`
2. The HTTP server receives the request and checks the file directory for the existence of the file.
3. The HTTP server issues a response to the browser with the content of the `lion.html` file as a body of the response.
4. The browser parses and renders the HTML and displays the resulting web page in its viewport.

This type of interaction is very much along the lines of what was happening with the simple HTTP server in the previous course.

## Dynamic Content

- Dynamic content is content that is created *on-the-fly,* in response to an HTTP request, via server-side processing. This processing often involves combining data with some templated HTML.
- Dynamic content, rather than being pre-created and simply stored on the server in order to be served to the client, is created *on-the-fly* in response to individual HTTP requests. In this context there is no actual `lion.html` file stored on the server. Instead, some sort of processing takes place on the server in order to *create* the HTML that is then served to the browser in the HTTP response.

Processing of dynamic content

- This processing will often involve combining some data (stored in a database, for example) with a HTML template, in order to form a complete HTML page which can be rendered by a browser. 
- A visual representation of such a system might look something like this:



![Diagram showing client server interaction with HTTP server, Application server, database, and file system](https://da77jsbdz4r05.cloudfront.net/images/js175/lesson_1/introduction-static-vs-dynamic-dynamic-content-diagram.png)

<u>Generalized model for how requests for dynamic content are handled</u>.

As you can see, this is a little more complex in structure than our static content example. Let's break down what's happening:

1. The browser (client) makes a request for the `/lion` resource.
2. The HTTP server receives a request from the browser (client) for the path `/lion`.

   - If the request had been for a static asset, such as CSS file (e.g. `styles.css`), then the HTTP server could just have sent this to the browser as the body of the response.
   - In this case the request is for the path `/lion`; notice that unlike our earlier example there is no `.html` file extension. This is because there is no `lion.html` file, the path acts more as an end-point for an abstract resource. We'll explore this concept some more in a later lesson.
3. Since the HTTP server identifies the request as being for dynamic content rather than a static asset, it passes appropriate details of the request such as the HTTP method, the path, and any relevant header information, to the application server for processing. 
   - Don't worry for now about exactly *how* the HTTP server identifies the request as being for dynamic content, just take it as a given that it does so.
4. The application server receives details of the request from the HTTP server and uses those details to generate some content.

   - The exact processing that happens in order to generate this response will vary depending on the application, but one example might involve fetching some data from a data store and combining this data with a HTML template to form all of the HTML required to render a complete web page.
5. Once the content has been generated, it will be passed to the HTTP server. 
6. The HTTP server then sends a HTTP response to the browser which contains the generated HTML as the response body.
7. The browser parses and renders the HTML and displays the resulting web page in its viewport.
   - Viewpoint: the region of the screen used to display a portion of the total image to be shown. 

- One thing to note though is the role of the client in the overall process. 
  - If you compare our two examples of static and dynamic content, all the additional steps in the dynamic one occur on the *server* side. 
  - On the client side, the browser doesn't know or care whether the content is dynamically generated or not. As far as the browser is concerned, in both cases it made a request for a web page and received some HTML back in response (we're using the example of HTML for simplicity, but dynamic content could be some other data type such as JSON or even a PDF file).

## Single Page Applications

- With Single Page Applications (SPAs), the boundaries between static and dynamic content is blurred. 
- Different to the example for static server-generated content: 
  - With SPAs, web pages aren't pre-created and served by the server, but rather they are dynamically generated in the browser using JavaScript. 
  - The server serves static assets such as HTML and CSS files and JavaScript to the client, who then does all the necessary processing in the browser to generate the dynamic content. 
- SPA also different to the dynamic server-generated content example
  - Since the server just serves the files and doesn't carry out any processing. 
- SPAs don't necessarily need to make a new HTTP request in order to generate a new page view; an HTTP request may sometimes be made to fetch some data, but there isn't the same relationship between a web page and a HTTP request-response cycle that there is with server-generated content.

- We aren't going to concern ourselves with SPAs in this course. Whenever we refer to dynamic content, take this as meaning content that is generated via processing on the server.

Chatgpt: SPAs, on the other hand, are a type of web application architecture that loads a single HTML page and dynamically updates its content using JavaScript and APIs, instead of reloading entire pages. While SPAs can use Ajax to make asynchronous requests, they are not reliant on Ajax, and can also use other techniques like WebSockets or server-sent events.

# HTML Recap

In the [previous course](https://launchschool.com/lessons/0e67d1ce/assignments/3d0e0a8b), we suggested that you read through the first half of [Lesson 1](https://learn.shayhowe.com/html-css/building-your-first-web-page/) of Shaye Howe's HTML tutorial. If you didn't do so then, you should definitely do so now. Even if you did, it may well be worth revisiting it in order to refresh your mind on the key concepts. You can also take LS202 now if you haven't done so already.

During this course, we'll learn how to create dynamic content with HTML templates. To approach that concept with clarity, you need a basic understanding of HTML and how an HTML page is structured. However, there's no need for mastery at this stage. For now, some key concepts to be clear on are:

- HTML defines the *structure* of a web page.
- The way this structure is defined is through the use of HTML *elements*
- There are different *types* of element for denoting different things, such as headings, paragraphs, images, and so on.
- Elements are denoted within the HTML by *tags*. Most tags are comprised of an opening tag and a closing tag.
- Elements can be *nested* inside of each other, by placing an element between the opening and closing tags of another element.
- The basic document structure consists of an `<html>` element with a `<head>` element and a `<body>` element nested inside of it.

# Templating Engines

## What is templating used for

- Combining HTML with application logic was a common approach in the early days of dynamic content. But as applications became larger and more complex, a standard pattern of using templates emerged to create the separation between HTML and application logic.

- Templating is a way of separating application logic from presentation.
  - In other words separate the presentation layer (the design and layout of the web page) from the business logic layer (the code that processes data and makes decisions).

## What is a template & template engine

- A **template** is a pre-defined template with data and **placeholders.** 
  - It can be thought of as *moulds* for web pages, in that they define a consistent structure for the page. Within that structure the actual content (data) can change.
  - Templates contain **placeholders** which are then replaced with data.
  - The placeholders are usually where dynamic content should be inserted.

- A **template engine** is used to combine pre-defined templates with data. 

  - A template engine is a software tool used for generating dynamic content by combining pre-defined templates with data.  

  - Many template engines typically follow a two step process. 
    1. Template source is **compiled** to a function using a **compile() method** of the template engine.
    2. The compiled, generated method can then be called later on in the program to **render** the template by replacing placeholders with actual data.
  - When the compiled function is executed with a data object, the engine uses the placeholders as a guide to determine where to insert the corresponding values from the data object.

#### figure & code demo

![image-20230331153822165](C:\Users\jenny\AppData\Roaming\Typora\typora-user-images\image-20230331153822165.png)

```js
let source =`
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>#{productName}</title>
  </head>
  <body>
    <h1>#{productName}</h1>
    <p>#{price}</p>
    <p>#{description}</p>
  </body>
</html>
`;

let productTemplate = MyTemplateEngine.compile(source);
// The compile method returns a function that is then
// assigned to the variable 'productTemplate'

let data = {
  productName: 'Widget',
  price: '20',
  description: 'A useful widget'
};

productTemplate(data);
// calling the productTemplate() function combines the data and template
// and returns HTML
```

#### Shorthand templating language

- Some template engines use a shorthand, pre-processor style templating language rather than just embeding placeholders in standard HTML.
  - The HTML elements are represented in shorthand notation instead of using the normal HTML tag with opening and closing HTml tags.
  - Nesting of elements is indicated via indentation, so the `meta` and `title` elements are nested inside the `head` element, and the `h1` and `p` elements are nested inside the `body` element. 
- When the template is compiled, the shorthand is converted to actual HTML, so `h1 #{productName}` becomes `<h1>#{productName}</h1>`.

```javascript
head
  meta(charset='utf-8')
  title #{productName}
body
  h1 #{productName}
  p #{price}
  p #{description}
```

- This kind of shorthand notation is essentially an abstraction, and like all abstractions it has its pros and cons. There's something of a learning curve to become familiar with the syntax, but once that familiarity is gained it can speed up the writing of templates.

- Don't worry too much about this for now. Later in the course we'll work with a template engine, [Pug](https://pugjs.org/api/getting-started.html), which uses this approach.

#### Other advantages of template engines

As well as this key difference with template literals, templating engines also have other advantages. 

- Most templating engines include built in functionality for escaping input, which helps prevent XSS attacks. 
- As well as this, many templating engines have built in helper methods which allow you to do things like use conditional statements, looping constructs and partial templates in your templates. 
  - Conditionals are useful if you only want to output a particular part of the template if a condition is met or not met (for example a login form if a user is not logged in). 
  - Looping constructs can be used to render repeating output, such as lists. Partials are useful for breaking up larger templates into smaller chunks.

#### Compiling and pug

When working with Pug, there are different ways you might use it, and the compilation step might be either visible or abstracted away:

1. **Direct Compilation and Rendering (Hidden Compilation):**

   - When you use Pug in a way that directly renders templates with data (e.g., using `pug.render`), the compilation happens behind the scenes. Pug internally compiles the template into a JavaScript function and then immediately uses that function to render the HTML.

   - Example

     ```javascript
     const html = pug.render('p Hello, #{name}!', { name: 'John' });
     console.log(html); // <p>Hello, John!</p>
     ```

     In this case, Pug internally compiles the template and renders it in one step. As a developer, you don’t see the compilation step explicitly.

2. **Explicit Compilation (Visible Compilation):**

   - You can explicitly compile a Pug template into a reusable function using `pug.compile`. This separates the compilation from the rendering process.

   - Example

     ```javascript
     const compiledFunction = pug.compile('p Hello, #{name}!');
     const html = compiledFunction({ name: 'John' });
     console.log(html); // <p>Hello, John!</p>
     ```

     Here, you compile the template once into a function (

     ```javascript
     compiledFunction
     ```

     ), and then you can use that function multiple times to render HTML with different data.

## Handlebars

- Handlebars is a templating engine

## Rendering

- **Rendering** means to pass a data object and template to a templating engine.
- In the context of an Express.js application, the **view engine** is the templating engine. Express.js doesn't have a templating engine, but Pug does.
- We add this code to our js file to set our view engine to pug. 

```js
// Sets the view directory and view engine to pug
app.set("views", "./views");
app.set("view engine", "pug");
```

- This code shows that the contacts view template is rendered with a sorted list of contacts when "/contacts" path is requested.

```js
app.get("/contacts", (req, res) => {
  res.render("contacts", {
    contacts: sortContacts(contactData),
  });
});
```

Such as in express.js

- Renders a `view` and sends the rendered HTML string to the client. Optional parameters:

  - `locals`, an object whose properties define local variables for the view.

  - `callback`, a callback function. If provided, the method returns both the possible error and rendered string, but does not perform an automated response. When an error occurs, the method invokes `next(err)` internally.

## Pug

- Pug is a templating engine commonly used in web development to generate HTML content dynamically. It provides a more concise and indentation-based syntax compared to traditional HTML, making it easier to write and manage templates.
- Pug (formerly known as Jade) is a popular choice for templating in Node.js and web frameworks like Express.js. It allows you to define your views in a more organized and readable manner by using indentation to represent nesting and hierarchy.

## views/ view engine

- In the context of web development and frameworks like Express.js, the terms "view" and "template" are often used interchangeably.
  - A view or template typically contains placeholders for dynamic data, which are replaced with actual values when the view/template is rendered. These placeholders allow you to generate personalized and dynamic content for each user or request.
- A view engine = template engine

# Core components of HTTP Server Processing 

![image-20230402150319974](C:\Users\jenny\AppData\Roaming\Typora\typora-user-images\image-20230402150319974.png)

- Client (browser) sends an HTTP Request to the HTTP Server, who processes the request, then sends an HTTP Response back.
- The server-side processing occurs in a series of steps. Various components work together to serve dynamic and static content.
  1. The **routing engine** is responsible for receiving incoming HTTP requests and determining which route should handle the request. The routing engine uses the URL path and HTTP method to identify the appropriate route that maps to the specific request handler.
  2. **Route**: is a particular combination of an HTTP method and URL path, as well as the request handler (application logic) that is executed when that combination is matched in order to generate an HTTP response.
  3. **Request Handler**: Once the routing engine identified the appropriate route, the corresponding request handler is called to handle the request. The request handler is a function that contains the **application logic** which is executed to generate an HTTP response. 
  4. Dynamically created content: If the requested resource is dynamically requested, the application logic generates the appropriate dynamic content.
     - **Templating Engine**: The templating engine generates dynamic content by combining pre-defined templates with data.
  5. File system for static files: If the requested file is a static asset such as image, CSS file, or JavaScript file, the server retrieves the file from the file system and serves it directly to the client without the need for further processing.

# Middleware

## What is a middleware

- **Middleware** is a function that accepts `req` and `res` objects, 
- They are executed before or after the request handler which can modify the request or response objects.

Components above

- The components above are the core components of HTTP Server-side processing.
- The routing engine is not middleware because it is responsible for the overall routing of request. 

## Examples of middleware

#### `router()` function

- Reminder: Initializing a router module returns an instance of a router object which is a router function. 

- The `router()` function is considered middleware because it is responsible for the specifics of handling those HTTP requests and responses objects.

  - It sits between the server and the request handler and provides different functionalities.

- One functionality: When `router()` is invoked in the manner below, it searches its stack of routes for a match and invokes the request handler associated with that route.

  ```js
  router(req, res, FINALHANDLER(req, res));
  ```

  - The **stack of routes** was created when routes are pre-defined in this format.

    ```js
    router.get('/', function (req, res) {
      // body of request handler
    });
    ```

  - The request handler uses application logic to read data from the `req` , manipulate it as needed then send a response back to the client by modifying the `res`object.

- Another functionality that `route()` provides is **Middleware chaining** - see section on middleware chaining.

#### `serve-static`

- The `serve-static` is a package that provides a middleware function for serving static files.

  - When the package is loaded, it 

    > Create(s) a new middleware function to serve files from within a given root directory.

- Middleware chaining with `serve-static`

  - In this code we add `serve-static` to our middleware chain by calling `use()` on our `router` instance.

  ```javascript
  router.use(SERVESTATIC('public'));
  ```

  - This will cause `router` to pass any `req` and `res` objects it receives to the `SERVESTATIC` middleware.
  - `SERVESTATIC` will check for the existence of a file defined by `req.url`. 
    - The `'public'` string passed to the `SERVESTATIC` function identifies the root directory within which to search. 
    - If a file is found, our server will send its contents in the HTTP response, if not then Node moves on to the next middleware, which is the `router` function itself.

## middleware Chaining

- Another functionality that `route()` provides is **Middleware chaining**: is handling multiple middleware functions that need to be executed in sequence for a particular request.
- When middleware functions are chained together, the request object is passed through each middleware function in turn, and each function ca modify the request object. 

#### `use()` method

- In Express.JS, middleware functions are typically added to the stack of middleware functions using the `use()` method, which means they will be executed in the order in which they were added.

- `app.use([path,] callback [, callback...])` in express.js

  Mounts the specified [middleware](https://expressjs.com/guide/using-middleware.html) function or functions at the specified path: the middleware function is executed when the base of the requested path matches `path`.

#### `FINALHANDLER`

- The `FINALHANDLER` package is used to terminate the middleware chain.

# Understanding abstractions

Path as an abstraction

- Instead of specifying a file path on the server's file system, URL paths map to specific application logic or static resources.

- The **application logic** generates dynamic content. So URL paths as an abstraction is useful for creating dynamic content.

Routes

- **Route** is a particular combination of an HTTP method and URL path, as well as the application logic that is executed when that combination is matched in order to generate an HTTP response.
  - The application logic that is executed is commonly referred to as a **request handler**.

- Routes let you use the URL path as an abstraction, rather than a reference to a specific location within the server file system.
- Within a networked application, routing is often handled by a routing engine which abstracts away the complexity of matching routes and executing request handlers.

Frameworks

- **Frameworks** abstract away the functionality of middleware components like `serve-static` and `router` even further to provide a simpler and more consistent interface.
  - `router` package is extracted from the **Express.js framework**.
- The various tools, libraries, and frameworks used in developing networked applications are essentially layers of abstraction on top of what's happening at the base level, which is interaction of application logic with HTTP requests and responses.

# Loan calculator code demo

```js
const HTTP = require('http');
const URL = require('url').URL;
const QUERYSTRING = require('querystring');
// we no longer require path and fs modules because the functionality they provided is now abstracted
// to serve-static
const ROUTER = require('router');
const FINALHANDLER = require('finalhandler');
const SERVESTATIC = require('serve-static'); // SERVESTATIC middleware function for serving static files.
const PORT = 3000;
const HANDLEBARS = require('handlebars');
const APR = 5;

const LOAN_OFFER_SOURCE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loan Calculator</title>
    <link rel="stylesheet" href="/assets/css/styles.css">
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <table>
        <tbody>
          <tr>
            <th>Amount:</th>
            <td>
              <a href='/loan-offer?amount={{amountDecrement}}&duration={{duration}}'>- $100</a>
            </td>
            <td>$ {{amount}}</td>
            <td>
              <a href='/loan-offer?amount={{amountIncrement}}&duration={{duration}}'>+ $100</a>
            </td>
          </tr>
          <tr>
            <th>Duration:</th>
            <td>
              <a href='/loan-offer?amount={{amount}}&duration={{durationDecrement}}'>- 1 year</a>
            </td>
            <td>{{duration}} years</td>
            <td>
              <a href='/loan-offer?amount={{amount}}&duration={{durationIncrement}}'>+ 1 year</a>
            </td>
          </tr>
          <tr>
            <th>APR:</th>
            <td colspan='3'>{{apr}}%</td>
          </tr>
          <tr>
            <th>Monthly payment:</th>
            <td colspan='3'>$ {{payment}}</td>
          </tr>
        </tbody>
      </table>
    </article>
  </body>
</html>
`;

const LOAN_FORM_SOURCE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loan Calculator</title>
    <link rel="stylesheet" href="/assets/css/styles.css">
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <form action="/loan-offer" method="post">
        <p>All loans are offered at an APR of {{apr}}%.</p>
        <label for="amount">How much do you want to borrow (in dollars)?</label>
        <input type="number" name="amount" id="amount" value="">
        <label for="duration">How much time do you want to pay back your loan?</label>
        <input type="number" name="duration" id="duration" value="">
        <input type="submit" name="" value="Get loan offer!">
      </form>
    </article>
  </body>
</html>
`;

const LOAN_OFFER_TEMPLATE = HANDLEBARS.compile(LOAN_OFFER_SOURCE);
const LOAN_FORM_TEMPLATE = HANDLEBARS.compile(LOAN_FORM_SOURCE);

function render(template, data) {
  let html = template(data);
  return html;
}

function parseFormData(request, callback) {
  let body = '';
  request.on('data', chunk => {
    body += chunk.toString();
  });
  request.on('end', () => {
    let data = QUERYSTRING.parse(body);
    data.amount = Number(data.amount);
    data.duration = Number(data.duration);
    callback(data);
  });
};

function getParams(path) {
  const myURL = new URL(path, `http://localhost:${PORT}`);
  let searchParams = myURL.searchParams;
  let data = {};
  data.amount = Number(searchParams.get('amount'));
  data.duration = Number(searchParams.get('duration'));

  return data;
};

function calculateLoan(amount, duration, apr) {
  let annualInterestRate = apr / 100;
  let monthlyInterestRate = annualInterestRate / 12;
  let months = Number(duration) * 12;
  let payment = amount *
    (monthlyInterestRate /
      (1 - Math.pow((1 + monthlyInterestRate), (-months))));

  return payment.toFixed(2);
};

function createLoanOffer(data) {
  data.amountIncrement = data.amount + 100;
  data.amountDecrement = data.amount - 100;
  data.durationIncrement = data.duration + 1;
  data.durationDecrement = data.duration - 1;
  data.apr = APR;
  data.payment = calculateLoan(data.amount, data.duration, APR);

  return data;
};
// router is assigned to the router object returned by calling ROUTER() function.
let router = ROUTER();
// add the serve-static function to middleware chian
// the 'public' string passed to the serve-static function is the root directory that it will search from.
// If file is found, server sends the static content in HTTP response, if not, then Node moves to
//  the next middleware, which is router function itself. 
// This means requests for static files in public directory will be routed to SERVESTATIC instead of 
// The other routes. 
router.use(SERVESTATIC('public')); 
router.get('/', function (req, res) {
  let content = render(LOAN_FORM_TEMPLATE, { apr: APR });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write(`${content}\n`);
  res.end();
});

router.get('/loan-offer', function (req, res) {
  let data = createLoanOffer(getParams(req.url));
  let content = render(LOAN_OFFER_TEMPLATE, data);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write(`${content}\n`);
  res.end();
});

router.post('/loan-offer', function (req, res) {
  parseFormData(req, parsedData => {
    let data = createLoanOffer(parsedData);
    let content = render(LOAN_OFFER_TEMPLATE, data);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(`${content}\n`);
    res.end();
  });
});
// catch-all routes using wildchard character *
// This route is matched for any GET request where path doesn't already match a pre-defined route.
// This catch-all route responds with 404 Not Found status.
router.get('*', function (req, res) {
  res.statusCode = 404;
  res.end();
});
// Body of createServer is now reduced to one line.
// Router and serve-static abstracted out all the logic for handling requests for pre-defined routes
//  and static assets.
const SERVER = HTTP.createServer((req, res) => {
  router(req, res, FINALHANDLER(req, res));
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
```

## Explanation

Where our application logic is now

- Handling dynamic content: The application logic for handling dynamic content is contained within the request handler functions in the routes. 

  - `router.post` and `router.get` are used to pre-define the routes. 

- Handling static content: Another part of the application logic is in the middleware chain where `SERVESTATIC` added to the middleware chain of `router` by using `use()` method.

  ```js
  router.use(SERVESTATIC('public')); 
  ```

  - This means that any request that matches a static file in the root "public" directory will be handled by the `SERVESTATIC` middleware function, and the server sends the static content in the HTTP response.
  - If the request doesn't match a static file in the "public" directory, then Node moves to the next middleware, which is the `router` function itself.

- Handling content that doesn't match pre-defined route

  - We also added a 'catch-all' route on lines 169-172 by using the wildcard character `*`. This route is matched for any `GET` request where the path doesn't already match a pre-defined route. 
  - The catch-all route simply responds with a `404 Not Found` status.

What createServer() does now

- `createServer()` creates a new HTTP server instance and sets up the routing and middleware logic for handling incoming requests. 

- Or Node `SERVER` now purely focuses on the job of listening for connections and managing `req` and `res` objects. 

  ```js
  const SERVER = HTTP.createServer((req, res) => {
    router(req, res, FINALHANDLER(req, res));
  });
  ```

- This is because we used `router` and `serve-static` to  abstract out all of the logic for handling requests for pre-defined routes and static assets.

# Express.js and Pug

- Express.js is an application framework for use with Node.js, while Pug is one of the many templating engines supported by Express.
- Together, they help you write web applications quickly and easily.
- What to know
  - Be generally familiar with what is covered and where.
  - Remember: we're not asking you to completely master Express and Pug. While you will have to learn Express well enough to write simple applications, a general understanding of how you can use them and what they do is sufficient. 
  - More importantly, try to learn how and why Express and Pug are used and their general structure - it's very likely that you will encounter similar software later, either in Core, Capstone, or on the job. 

# Helpful commands

## Curl

- Download images

  ```terminal
  curl -o /folder/path/image.jpg theimagelink
  ```

- Making GET requets 

  ```terminal
  $ curl http://localhost:3000/
  ```

## nodemon

- `nodemon` is a Node program that monitors an application's files for any changes and restarts the program each time a file changes.
  - It is great for automatic reloading of our application files.
- install `nodemon`:
  - `nodemon` is a development tool; you shouldn't use it in production environments. Thus, we installed it as a development tool with the `--save-dev` option.

```terminal
$ npm install nodemon --save-dev
```

- Using scripts with `nodemon`

  - Now that we've installed `nodemon`, we can change the `start` script in our `package.json` file to use it:
  - Now no longer have to remember to use `npx nodemon` to start the program.

  package.json

  ```js
  {
    // omitted code
    "scripts": {
      "start": "npx nodemon hello.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    // omitted code
  }
  ```


- Script commands

  - Run the script with this command. 

  ```terminal
  npm script
  ```

- `rs` to restart

  - Note the message that you can restart the project at any time by entering `rs`. 

  ```plaintext
  [nodemon] restarting due to changes...
  [nodemon] starting `node hello.js`
  Listening to port 3000.
  ```

# Express.js

## Express.js Documentation

[Express](https://expressjs.com/)

- Look at Getting Started, Guide, and API Reference.
- API reference is valuable resource when working with the Application, Request, and Response objects.
  - For API reference, make sure you use the correct version of the documentation. If you aren't sure which version to use, check `package.json` file to see what version it expects. 

## Topics & Vocab

### `app` object

- The `app` object conventionally denotes the Express application. Create it by calling the top-level express() function exported by the Express module. 

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(3000)
```

The `app` object has methods for

- Routing HTTP requests; see for example, [app.METHOD](https://expressjs.com/en/5x/api.html#app.METHOD) and [app.param](https://expressjs.com/en/5x/api.html#app.param).
- Configuring middleware; see [app.route](https://expressjs.com/en/5x/api.html#app.route).
- Rendering HTML views; see [app.render](https://expressjs.com/en/5x/api.html#app.render).
- Registering a template engine; see [app.engine](https://expressjs.com/en/5x/api.html#app.engine).

### `app.locals`

- `app.locals` is a property on `app` that is an object with properties which define local variables within the application, and will be available in templates rendered with `res.render`. 
- The value of `app.locals` properties persist throughout the life of the application, in contrast with `res.locals` properties that are valid only for the lifetime of the request.
- `app.locals` should be used to define view helper functions.

### `app.use`

- `app` refers to an instance of the Express application we created using `express()`.
- `.use()` is an Express middleware function that is used to add middleware to the application's request handling pipeline. 
- Middleware functions passed to `app.use()` are executed for every incoming request to your Express application. They are executed in the order they are added using `app.use()`. This allows you to perform common tasks or modifications on the request or response objects before the request reaches the intended route handler.

### `res.locals`

- Use `res.locals` to pass values between middleware functions.

- `res.locals` is an object that is available within the scope of a single request-response cycle, which means it can be accessed and modified by any middleware function or route handler that is executed during that cycle. This includes any middleware functions or route handlers that are invoked after the middleware that sets the values of `res.locals`. 
- However, once the response has been sent to the client, the values of `res.locals` are no longer available.

### `req.body()`

- In Express.js, the `req.body` object contains key-value pairs of data that is sent as part of an HTTP POST request. The data is parsed from the request body and stored as properties on the `req.body` object.
- If a user doesn't input a value for a particular input field or property in an HTTP POST request, the corresponding key-value pair in `req.body` will still exist, but its value will be an empty string.

#### `req.params`

req.params

This property is an object containing properties mapped to the [named route “parameters”](https://expressjs.com/en/guide/routing.html#route-parameters). For example, if you have the route `/user/:name`, then the “name” property is available as `req.params.name`. This object defaults to `{}`.

```javascript
// GET /user/tj
console.dir(req.params.name)
// => "tj"
```

### `res.render()`

`res.render(view, [locals], [callback])`

- Renders a `view` and sends the rendered HTML string to the client. Optional parameters:

  - `locals`, an object whose properties define local variables for the view.

  - `callback`, a callback function. If provided, the method returns both the possible error and rendered string, but does not perform an automated response. When an error occurs, the method invokes `next(err)` internally.

- Example

  ```js
  // Render the list of todo lists
  app.get("/lists", (req, res) => {
    res.render("lists", {
      todoLists: sortTodoLists(todoLists),
    });
  });
  ```

- Conventions `render` vs `redirect`

  - By convention, we use `render` to handle errors that redisplay the same page, and `redirect` to handle success. 
  - We can also use `redirect` for errors that display a new page rather than redisplaying the original page. 
  - Pay attention to the arguments for `res.render` and `res.redirect`: `render` uses the name of a view template, but `redirect` needs a path.


### `res.redirect`

<u>res.render vs res.redirect</u>

- While handling POST requests, web developers conventionally use `res.render` to redisplay the form. They call `res.redirect` when they need to display some other page. 
- Typically, you should re-render the page to handle validation errors and use redirection after a successful operation.

### `res.send()`

`res.send([body])`

- Sends the HTTP response back to client (browser).

- The `body` parameter can be a `Buffer` object, a `String`, an object, `Boolean`, or an `Array`. For example:

```javascript
res.send(Buffer.from('whoop'))
res.send({ some: 'json' })
res.send('<p>some html</p>')
res.status(404).send('Sorry, we cannot find that!')
res.status(500).send({ error: 'something blew up' })
```

This method performs many useful tasks for simple non-streaming responses: For example, it automatically assigns the `Content-Length` HTTP response header field (unless previously defined) and provides automatic HEAD and HTTP cache freshness support.

When the parameter is a `Buffer` object, the method sets the `Content-Type` response header field to “application/octet-stream”, unless previously defined as shown below:

```javascript
res.set('Content-Type', 'text/html')
res.send(Buffer.from('<p>some html</p>'))
```

When the parameter is a `String`, the method sets the `Content-Type` to “text/html”:

```javascript
res.send('<p>some html</p>')
```

When the parameter is an `Array` or `Object`, Express responds with the JSON representation:

```javascript
res.send({ user: 'tobi' })
res.send([1, 2, 3])
```

### `express.urlencoded([options])`

- `express.urlencoded()` is a middleware function in the Express.js framework that is used to parse incoming request bodies that are encoded using the URL encoding format.
- When a client sends a POST request to an Express.js application with data in the request body, it can be encoded using different formats such as URL-encoded, JSON, or multipart/form-data.
- If the data is in the URL-encoded format, the `express.urlencoded()` middleware parses the data and populates the `req.body` object with the parsed data, which can then be accessed by subsequent middleware or route handlers.
- The `express.urlencoded()` middleware takes care of decoding the data and populating the `req.body` object with the parsed data, so that developers don't have to do it manually. 

### `express.validator` module

- There is no official `express.validator` module in Express, but there is a popular third-party module called `express-validator` that can be used for input validation and sanitization.

- `express-validator` provides middleware functions that can be used to <u>validate and sanitize user input</u> data in HTTP requests. It can check data types, string lengths, regular expressions, and more. It can also sanitize data by removing unnecessary characters or escaping special characters to prevent injection attacks.

### `error.msg`

- `express-validator` stores error messages as an array of objects that look something like this:

```js
{
  value: "",
  msg: "The list name is required.",
  param: "todoListTitle",
  location: "body"
}
```

- Thus, if we want to extract the error message from this object, we need to use the `msg` property.

- ```js
  errors.array().map(error => error.msg), //extract error message from error object
  ```

  

### Static assets

- **assets**: components that web pages need in addition to the HTML that the user's browser receives form the server. This includes images, stylistic modifications, fonts, client-side JavaScript code, and more.
- Most are **static assets** -- they aren't created on the fly but get downloaded from the server by the browser. Each time the browser requests the assets, it usually downloads the same asset it did before.

Where to reference assets

- Some assets, like fonts and CSS, need to be referenced inside the `head` portion of your view. Others, such as images, are referenced in the `body`. 
- Still others, like `script`, can be referenced from either the `head` or the `body` (however, where you specify the JavaScript can influence its behavior).

Using assets in our application

- Most Express applications place static resources in a subdirectory of the project folder called `public`.
- We need to tell our application where to look for static assets: in the `public` directory. For that, we need the `express.static` method:
  - This calls `express.static` to create a middleware function which then tells Express to add the middleware function to the middleware chain by passing it to `app.use`.

```js
app.use(express.static("public"));
```

### `morgan` logging

- A more natural way to log data from an Express application is to use the [morgan module](https://github.com/expressjs/morgan). Let's install it:

```terminal
$ npm install morgan --save
```

Now that it's installed, let's update the application:

hello.js

```js
const express = require("express");
const morgan = require("morgan");
const app = express();

// Delete the following function
// const writeLog = (req, res) => {
//   let timeStamp = String(new Date()).substring(4, 24); // Mmm dd YYYY HH:MM:SS
//   console.log(`${timeStamp} ${req.method} ${req.originalUrl} ${res.statusCode}`);
// };
```

- The `app.use(morgan("common"));` call sets the output log format to the "common" format, a format that is standard in Apache web servers. 
- It provides a lot of useful information in a reasonably compact format:

```plaintext
127.0.0.1 - - [26/Oct/2019:23:48:48 +0000] "GET /english HTTP/1.1" 200 823
```

##### Good practice

- Information like this can be useful for debugging purposes. 
- It's good practice to always use morgan or a similar logging mechanism in your Web applications. 
- It's also helpful in production code for statistical purposes, security audits, and more.

##### Favicon

Be aware that logging sometimes produces entries that seem weird and out of place. For instance, you may have seen something like this in your logs:

```plaintext
127.0.0.1 - - [26/Oct/2019:23:48:38 +0000] "GET /favicon.ico HTTP/1.1" 404 150
```

Where did that request come from, and why is the status code `404`? 

- Most browsers request a **favicon** from every server they meet. They use it to supply icons that represent the site, such as the icons on your tabs and bookmarks. Not every server has a favicon, but the browser always asks for one when it doesn't already have one in its cache. 
- In this case, we don't have a favicon, nor do we have any routes that match the request, so the server responds with a `404`.

------

### Routes

- A route can be thought of as a particular combination of HTTP method and URL path, and the application logic that is executed when that combination is matched in order to generate an HTTP response.
- The application logic that is executed is commonly referred to as a *request handler.*
- Routes let you use the URL path as an abstraction, rather than as a reference to a specific location within the server file system.
- Within a networked application, routing is often handled by a routing engine which abstracts away the complexity of matching routes and executing request handlers.

### Route handler

```js
app.get("/", (req, res) => {
  res.send("Hello world!\n");
});
```

- **route controller** or **route handler** is the callback function that `get` calls when it receives an HTTP request -- when the HTTP request matching a particular route is received by an Express application.  
  - In Express.JS a request handler is referred to as a route handler and is used to handle specific HTTP request for a particular URL path. The route handler gets executed when a request is made to a specific URL endpoint. 

- It is responsible for handling requests that match a specific path.
- Route handlers are typically defined using methods such as `app.get()`, `app.post()`, `app.put()`, and `app.delete()`. 
- By convention, many Express programs use the `req` and `res` names for the objects to access and manipulate the request and response. In this callback, we call `res.send` to issue a simple text response, e.g., `Hello world!`.

### Path pattern

- The path passed to a route is frequently called a **path pattern**.
- Usually, there is no need to distinguish between the resource that the browser requests and the pattern in the Express route. However, if you need to be clear about it, you should talk about the path pattern.

### Parameterized Routes

- Express provides support for using routes that match a parameterized pattern. 

  - This means that the **path pattern** -- the first argument -- passed to `app.get` can include placeholders(**parameters**) that match information in the path.
  - The format of the path, together with the HTTP method, determines which route should respond to the request. 
  - A **parameterized route** allows us to eliminate multiple routes with duplicate code --> which means we don't have to hard code specific paths into our application logic.
  - Note that parameters are always strings.

- For example, if our Express application has these routes. 

  - a **parameter** is `:list_id`. 

  ```js
  app.get("/lists/edit", ...);
  app.get("/lists/:list_id", ...);
  app.get("/lists/:list_id/destroy", ...);
  app.get("/lists/xyzzy", ...);
  ```

  - The route on line 1 handles requests for `/lists/edit` and nothing else.
  - The route on line 2 handles requests for `/lists/5`, `/lists/37`, or even `/lists/abc`. In each case, the `:list_id` matches the corresponding part of the path (`5`, `37`, or `abc`). Note, however, that this route does not respond to requests for `lists/edit`. Only the first matching route for a particular method gets called.
  - The route on line 3 handles requests for `/lists/99/destroy` and `/lists/whatever/destroy`, as well as anything else that matches the pattern.
  - The route on line 4 never handles any requests since the route on line 2 gets control first.

- To access a **route parameter**, access a property of the `req.params` object with the name associated with the parameter.

  - The `req.params` object hold the captured values of the route parameters.
  - In the following example we can access parameters by using `req.params.listId` and `req.params.itemId`. 
  - Note that parameter values are always strings.

  ```js
  app.get("/lists/:listId/item/:itemId", (req, res) => {
    console.log(req.params.listId);
    console.log(req.params.itemId);
    res.send("All done");
  });
  ```

### Dealing with Invalid Parameters

- When there are invalid parameters, the error message results in a stack trace that may cause security concerns: an attacker can use the stack trace to find or exploit a security hole. 

#### validate user-supplied info

- Using user-provided data to access the file system is extremely risky.
  - If we don't validate the language obtained from a parameter and then try to access the file system with that language, it may allow attackers to access sensitive files.  
  - Even with validation, we have to be extremely careful to catch all the potential harmful inputs. 

- Validating user-supplied information also lets you write a better error message and set an appropriate HTTP status code on the response:
  - In this code, we use the `LANGUAGE_CODES` object to verify that we have a known language. When we detect an invalid language, we use `res.status` to set the HTTP status code to a 404 (Not Found) error.
  - We then send some plain text back in the response body that describes the error clearly. If we had a custom error view, we could render it instead of using `send`.

```js
app.get("/:language", (req, res) => {
  const language = req.params.language;
  const languageCode = LANGUAGE_CODES[language];
  if (!languageCode) {
    res.status(404).send(`Language not supported: ${language}`);
  } else {
    res.render(`hello-world-${language}`, {
      countries: COUNTRY_DATA,
      currentPath: req.path,
      language: languageCode,
    });
  }
});
```

#### Error Handler

- Error handlers are another way to handle errors.

- Error handlers are middleware functions that accept four arguments instead of three, with the first argument being an `Error` object.
- Error handlers must be the last middleware in your application, and must have 4 parameters, even if the handler doesn't use them all:
- In the below code
  - An error handling middleware function is added to the Express application. It takes 4 arguments `err`: the error that was passed to this middleware function through the `next` function. `req` is request object and `res` is response object. 
  - This middleware will be called if any middleware or route handler in the application calls the `next` function with an error argument.

```js
// Add this code just before the `app.listen` invocation.

// error handler
app.use((err, req, res, _next) => {
  console.log(err);
  res.status(404).send(err.message);
});
```

- `console.log` may write more extensive information to the console log than `send` would write to your browser. The additional information is invaluable to the developer but a security risk in a user's browser. That's why we send an abbreviated message to the browser, but log more detailed information on the server.

Calling `next` function with `Error` object as argument.

- `next` is a callback function that is used to pass control to the next middleware function or route handler in the chain. 
- Note that we need to define the `next` function in the parameter list for the route controller. 
- In this code `next` is called with an `Error` object if the requested language is not supported by the application. 
- When `next` is called with an error object, Express will immediately skip to the error-handling middleware in the chain we defined earlier with `app.use` to handle errors.

```js
app.get("/:language", (req, res, next) => {
  const language = req.params.language;
  const languageCode = LANGUAGE_CODES[language];
  if (!languageCode) {
    next(new Error(`Language not supported: ${language}`));
  } else {
    res.render(`hello-world-${language}`, {
      countries: COUNTRY_DATA,
      currentPath: req.path,
      language: languageCode,
    });
  }
});
```

![image-20230404161652381](C:\Users\jenny\AppData\Roaming\Typora\typora-user-images\image-20230404161652381.png)

## Middleware in Express.JS

#### What is a middleware

In express.js

- Express middleware functions are callback functions used by Express methods like `app.use` and `app.get`, among others. These functions can access and manipulate request and response objects per application requirements. 

  - In simple terms they are just callbacks that let you tell Express what to do with each request.

- The term **middleware** is shorthand for *Express middleware function*. You can use it as either a singular or plural noun. However, you may sometimes see **middlewares** used for the plural form.

- Middleware functions have the following signature: 

  ```js
  (req, res, next) => {
    // body of middleware
  }
  ```

  - The `req` and `res` parameters represent the request and response objects used by the middleware. 
  - `next` is a callback function that the middleware uses to invoke the next matching middleware.
  - You can omit `next` if you don't need it in the middleware.

#### What middleware does

- Middleware functions passed to `app.use()` are executed for every incoming request to your Express application. They are executed in the order they are added using `app.use()`. This allows you to perform common tasks or modifications on the request or response objects before the request reaches the intended route handler.

- Middleware must either generate an HTTP response or tell Express to execute the next middleware. 
- You can use calls like `render`, `send`, and `redirect` to generate a response; you can call the `next` function to execute the next middleware.
- Express calls the middleware in the same order that the application executes the definitions. For instance, suppose we had the following middleware functions defined:

##### Middleware control flow

<u>3 different aspects of control flow</u>

- When a middleware function stops running, the request/response processing flow moves on to the next middleware function in the chain (if there is one) or to the route callback function (if the request matches a route and method). 
- If a middleware function generates a response, it generates a response with `res.render`, then typically stops further processing of the request and sends a response back to the client. 
- However, if the middleware function does not generate a response and does not call `next` to move on to the next middleware function, the request may hang indefinitely, causing the application to freeze up until a timeout occurs.

```js
app.use((req, res, next) => {      // Middleware #1
  // do something
  if (somethingIsTrue) {
    res.render("foo");
  } else {
    next();
  }
});

app.use((req, res, next) => {      // Middleware #2
  // do something else
  next();
});

app.get("/stuff", (req, res) => {  // Middleware #3
  res.render("qux");
});
```

<u>What this code does</u>

- If our application receives a GET request for `/stuff`, Express first calls "Middleware #1". 
  - If #1 detects a condition that it needs to respond to, it calls `res.render` to generate that response. Processing of the request stops in that case. This means that the response was handled here and there's no need to pass control to the next middleware function.
  - Otherwise, the middleware calls `next` to invoke the next middleware (#2).

- If a middleware function fails to generate a response and doesn't call `next`, your program will hang -- freeze up -- until a timeout terminates the application. That may take several minutes.

- If "Middleware #2" gets called, it can do something else based on `req` and `res`. In this example, we don't issue a response. Instead, we call `next` to invoke the last middleware (#3).

- "Middleware #3" is the <u>callback</u> for `app.get("/stuff", ...)`. It gets called only when #1 and #2 call `next`, and the route and method match the request. 
  - **Route callbacks** in Express are a type of middleware function that is specific to a particular route and HTTP method. 
  - In many cases, route middleware doesn't have to call `next`, so we usually omit the `next` argument from the function definition.

##### Let Express know about middleware

- To let Express know about some middleware that it needs to run, we must provide it as a callback to one of Express's standard methods. In our example, we passed middleware to both `app.use` and `app.get`. 
- Typically, we should use `app.use` to define a middleware that must run for every HTTP request or each request for a specific path. 
- We should use `app.get`, `app.post`, or other method-specific routes to define middleware functions that apply to one particular path and HTTP method combination.

##### Ways to define middleware functions

Separate arguments or part of array

- You can define multiple middleware functions as separate arguments or as part of an array:

```js
app.use(
  (req, res, next) => {      // Middleware #1
    // do something
    if (somethingIsTrue) {
      res.render("foo");
    } else {
      next();
    }
  },
  (req, res, next) => {      // Middleware #2
    // do something else
    next();
  },
);
```

```js
app.use(
  [
    (req, res, next) => {      // Middleware #1
      // do something
      if (somethingIsTrue) {
        res.render("foo");
      } else {
        next();
      }
    },
    (req, res, next) => {      // Middleware #2
      // do something else
      next();
    },
  ]
);
```

Standalone functions

- Since this code is just JavaScript, you can also define middleware as standalone functions:

```js
const middleware1 = (req, res, next) => {
  // do something
  if (somethingIsTrue) {
    res.render("foo");
  } else {
    next();
  }
};

const middleware2 = (req, res, next) => {
  // do something else
  next();
};

app.use(middleware1, middleware2);
```

Function calls

- Express middleware is often disguised as function calls. 

<u>Example</u>

- For instance, our application currently includes this code:

```js
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
```

- Both function calls (`express.static` and `express.urlencoded`) return a middleware that, in turn, gets passed to `app.use`.  
- In the first line, `express.static` is a function that returns a middleware that handles requests for static assets in the `public` folder. 
- `express.urlencoded` returns a middleware that parses the request body as URL-encoded text, and stores it in `req.body`. 
- Since we place these calls before defining our routes, they both get control before the route callbacks do. In the case of `express.static`, requests for static assets bypass the route callbacks entirely.

#### Specialized error handler middleware

- There's also a specialized error handler middleware that takes four arguments:

  ```js
  app.use((err, req, res, next) => {
    // body of error handler
  });
  ```

  The first argument, in this case, is a value or object that specifies the error in question. The error handler should be the last middleware defined in the program. It must have all four parameters specified, even those it doesn't need.

- ------

  Error handlers are middleware functions that accept four arguments instead of three, with the first argument being an `Error` object.

- Error handlers must be the last middleware in your application, and must have 4 parameters, even if the handler doesn't use them all:

- In the below code

  - An error handling middleware function is added to the Express application. It takes 4 arguments `err`: the error that was passed to this middleware function through the `next` function. `req` is request object and `res` is response object. 
  - This middleware will be called if any middleware or route handler in the application calls the `next` function with an error argument.

```js
// Add this code just before the `app.listen` invocation.

// error handler
app.use((err, req, res, _next) => {
  console.log(err);
  res.status(404).send(err.message);
});
```

- `console.log` may write more extensive information to the console log than `send` would write to your browser. The additional information is invaluable to the developer but a security risk in a user's browser. That's why we send an abbreviated message to the browser, but log more detailed information on the server.

Calling `next` function with `Error` object as argument.

- `next` is a callback function that is used to pass control to the next middleware function or route handler in the chain. 
- Note that we need to define the `next` function in the parameter list for the route controller. 
- In this code `next` is called with an `Error` object if the requested language is not supported by the application. 
- When `next` is called with an error object, Express will immediately skip to the error-handling middleware in the chain we defined earlier with `app.use` to handle errors.

```js
app.get("/:language", (req, res, next) => {
  const language = req.params.language;
  const languageCode = LANGUAGE_CODES[language];
  if (!languageCode) {
    next(new Error(`Language not supported: ${language}`));
  } else {
    res.render(`hello-world-${language}`, {
      countries: COUNTRY_DATA,
      currentPath: req.path,
      language: languageCode,
    });
  }
});
```

![image-20230404161652381](C:\Users\jenny\AppData\Roaming\Typora\typora-user-images\image-20230404161652381.png)

#### Passing Data Between Middleware Functions

- Middleware can pass data to subsequent middleware in the middleware chain. 
  - For instance, the middleware created by `express.urlencoded` uses `req.body` to pass data from the request body to subsequent middleware. Middleware later in the chain can access `req.body` and its properties.

- Where, exactly, middleware places such data depends on the middleware's implementation. However, when writing reusable middleware for multiple applications, the middleware must avoid defining objects that may already be used by other middleware.
  - For example, if two middleware functions both define an object with the same name or property, but with different values or meanings, it can lead to conflicts and unexpected behavior when the middleware functions are used together in the same application.

`res.locals`

- If you're not writing reusable middleware but merely want to pass data from one local middleware to the next in the chain, you can add it as a property on `res.locals`. 
  - For instance:

```js
app.get(
  "/foo",
  (req, res, next) => {
    res.locals.id = getNextIdNumber();
    res.locals.name = req.body.name.trim().toUpperCase();
    res.locals.fooData = [1, 2, 3];
    next();
  },
  (req, res) => {
    res.render("bar", {
      id: res.locals.id,
      name: res.locals.name,
    });
  },
);
```

- `res.locals` is an object that is available to all middleware functions in the same request-response cycle in Express. It is used to store data that needs to be accessed by subsequent middleware functions, typically within the same request-response cycle.

- Data defined on `res.locals` has a lifetime limited to the current request/response cycle, and can, if desired, be accessed directly by view templates. 
- For instance, in the above code, our view can access `fooData` even though we don't explicitly pass it to `res.render`. However, it's usually better to pass variables to views as the 2nd argument to `res.render` as we did for `id` and `name`. Use `res.locals` only to pass the value between middleware functions.

`app.locals`

- In theory, you can also pass data between middleware with `app.locals`; it has a lifetime that corresponds to the lifetime of the application's process. That's useful when defining view helper functions and constant data. However, it's rarely helpful when data varies from one request to another.

#### What's Next?

That's it. Middleware isn't a very complicated topic. However, it does take some effort to get comfortable with the mechanics. 

- In particular, we must understand how and when Express calls each middleware. We also need to understand what happens when each middleware finishes running. 
- In some ways, just the fact that we use an unusual name to describe these callback functions is the most confusing aspect of middleware. In the end, however, they're just callbacks that let you tell Express what to do with each request.

In the next assignment, we'll return to our contact list application and address some of its shortcomings. In particular, we'll start by validating our inputs.

## Express-Validator

- [`express-validator` documentation](https://express-validator.github.io/docs/)
- Overview: `express-validator` is a set of [express.js](http://expressjs.com/) middlewares that wrap the extensive collection of validators and sanitizers offered by [validator.js](https://github.com/validatorjs/validator.js).

How to use `express-validator`

1. Do the validation chain on the form input.

2. Check if there were errors using `validationResult`

3. If there are errors, log the errors using flash message.

   ```js
   let errors = validationResult(req);
   if (!errors.isEmpty()) {
   	errors.array().forEach(message => req.flash("error", message.msg));
   }
     
   ```

Why `epxress-validator`

- The declarative style that `express-validator` allows simplifies the data validation tremendously.
- Our code should be cleaner and more understandable. It eliminates many of those messy `if` statements and other repetitive code.

Validator.js library

- The `validator.js` library provides standalone functions for validating input values, and each function takes a string as its first argument, which represents the value to be validated.
- On the other hand, `express-validator` provides a validation chain API, which allows you to chain validation methods together to create a validation chain. Instead of passing the value as an argument to each validation function, you first select the input to validate using one of the input sanitization functions (`body()`, `param()`, etc.), and then chain the appropriate validation methods to it.

How to use `express-validator`: Validation Chain API

- The easiest to run `express-validator` validations and sanitizers is to use the so-called **validation chain API**, which is middleware that you can use in your route callbacks. The syntax is somewhat flexible.
  - It means a chain of validation functions that will be executed in sequence, with each function checking a specific part of the request for validity. 
- The usual convention is to pass the validation chains to `app.post`, `app.get`, and others as part of an array argument. Typically, routes that use validation chains look something like this:

### `validationResult`

https://express-validator.github.io/docs/api/validation-result/

- gather results of validation checks performed on the request.
- returns an object containing the errors

```js
let errors = validationResult(req);
```

### `isEmpty`

- `isEmpty()` is a method provided by the `express-validator` library. It's used to check if a `validationResult` object is empty or if it contains validation errors.

### `.array()`

- The `errors.array()` method is called on the validation result object to retrieve the validation errors in a format suitable for further processing or presentation.

### `.msg`

- `error.msg` refers to the error message associated with a specific validation error.
- `msg` property (error message) from each error object. 

### `custom()`

- The `.custom()` syntax in the context of Express Validator is used to define a custom validation function for a specific field. It allows you to perform more complex validation logic that can't be achieved using the built-in validation methods alone.

- The `.custom()` method takes a callback function as an argument. This callback function must return `true` if the validation passes and `false` if it fails. The callback function receives the value of the field being validated as its parameter. In your case, it's the `title` of the todo list.

  ```js
  app.post("/lists/:todoListId/edit",
    [
      body("todoListTitle")
        .trim()
        .isLength({ min: 1 })
        .withMessage("The title must be at least 1 character long.")
        .isLength({ max: 100 })
        .withMessage("The title must be between 1 and 100 characters")
        .custom(title => { // custom() method for express-validator
          let duplicate = todoLists.find(list => list.title === title);
          return duplicate === undefined; // return true or false
        })
        .withMessage("List title must be unique")
    ], 
    // etc.
  ```

- `custom` validators need access to the `req` object so that they can access `req.session.property`. Fortunately, `express-validator` passes the `req` object as a property on its second argument. 

  ```js
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
  ```

  

## Flash Messages

- Flash messages are temporary messages that can be set in one request and displayed in the subsequent request. 

  - That's why we define our error messages with `req.flash`. 

- The first argument in `req.flash()` is typically the "type" of the flash message.  This type is used to categorize the flash message and is often associated with a specific CSS class in the view template to style the message accordingly.

  ```js
  req.flash("success", "success message");
  ```

- `express-flash` uses `express-session` to create sessions. With most error messages, `express-flash` doesn't need sessions, but it uses them regardless.

- We can install both modules with the following command:

  ```terminal
  $ npm install express-flash express-session --save
  ```

- Flash messages are stored as a single object in `req.session.flash`

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

- Thus, our template must handle the flash object when we pass it to the view.

- In JavaScript, we need to import and set up both `express-flash` and `express-session`.

  ```js
  const flash = require("express-flash");
  const session = require("express-session");
  ```

### Flash messages and redirects.

- Remember that in order for flash messages to be displayed, it must be passed to `res.render`. So if we use a redirect, the flash messages may not be displayed when directed to a different route & route handler. 
- The way to handle flash messages on a redirect is to create a middleware that extracts flash messages and puts them in `res.locals`. 
- The **middleware** is executed for every request, which means that before any view is rendered, the `flash` object is added to `res.locals`. 
- By doing this, you are making the flash messages available globally to your views without needing to pass `req.flash()` explicitly to each `res.render()` call. This is a common practice when dealing with flash messages in Express applications.

```js
// Add this code after `app.use(flash());`

// Extract session info
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});
```

- Reminder: Middleware functions passed to `app.use()` are executed for every incoming request to your Express application. They are executed in the order they are added using `app.use()`. This allows you to perform common tasks or modifications on the request or response objects before the request reaches the intended route handler.

### `req.flash`

https://www.npmjs.com/package/req-flash

- Unopinionated middleware for creating flash messages of all types for Express apps.

- Flash any amount of messages

  ```js
  app.get('/test', function() {
      req.flash('successMessage', 'You are successfully using req-flash');
      req.flash('errorMessage', 'No errors, you\'re doing fine');
   
      res.redirect('/');
  });
   
  app.get('/', function() {
      res.send(req.flash());
  });
  ```

- In the context of rendering a view, you do not need to include `req.flash()` as an argument in `res.render()` to render flash messages. Flash messages are automatically made available in the view context through the use of the `flash` middleware, so you don't need to pass them explicitly when rendering a view.

  Here's the correct usage:

  1. **Setting Flash Messages:** When you set flash messages using `req.flash()`, you're storing them in the session. For example:

     ```
     javascriptCopy code
     req.flash("success", "Todo list updated.");
     ```

  2. **Rendering the View:** When you render a view using `res.render()`, you don't need to include `req.flash()` as a separate argument. The flash messages set using `req.flash()` are automatically available in the view context through the `flash` middleware.

     ```
     javascriptCopy coderes.render("list", {
       todoList: todoList,
       todos: sortTodos(todoList)
     });
     ```

  3. **View Template (e.g., list.pug):** In the view template, you access the flash messages using the `flash` variable, which is automatically available in the view context due to the `flash` middleware.

     ```
     pugCopy codeif flash.success
       .success= flash.success
     ```

  In summary, you do not need to include `req.flash()` as an argument in `res.render()` to render the flash messages. The `flash` middleware takes care of making the flash messages available in the view context. I apologize for any confusion caused by my previous responses, and I appreciate your patience in seeking clarification.

- Q: Then why is req.flash() included in res.render in my code?

- 

  

  

  ChatGPT

  I apologize for any confusion caused. If you have `req.flash()` included in the `res.render()` function call in your code, it might be for a specific use case that's not immediately evident from the code you provided. It's possible that there could be some customization or additional logic in your application that requires this usage.

  In most cases, you don't need to include `req.flash()` as an argument in `res.render()` to render flash messages. Flash messages are automatically available in the view context through the `flash` middleware.

  Here's the standard approach for rendering flash messages:

  1. **Setting Flash Messages:** Set flash messages using `req.flash()` without any reference to them in the `res.render()` call:

     ```
     javascriptCopy code
     req.flash("success", "Todo list updated.");
     ```

  2. **Rendering the View:** When rendering a view, you don't need to include `req.flash()`:

     ```
     javascriptCopy coderes.render("list", {
       todoList: todoList,
       todos: sortTodos(todoList)
     });
     ```

  3. **View Template (e.g., list.pug):** Access the flash messages using the `flash` variable, which is automatically available:

     ```
     pugCopy codeif flash.success
       .success= flash.success
     ```

  If you're observing that `req.flash()` is included in the `res.render()` function call and you're wondering why, it might be helpful to review the surrounding code and the specific requirements of your application. Sometimes developers include additional logic or customization that might justify this usage, but in most cases, you can rely on the automatic availability of flash messages through the `flash` middleware.

## Code placement order

- In particular, the `app.set` calls should be first, followed by `app.use`, then `app.get` and `app.post`, and, finally, `app.listen`. In addition, some specific `app.get`/`app.post`

## Preserving User Input

- Let the view know about the user's input by adding it as a property on the object passed to `res.render`.

## Session Persistence

Why we need session persistence

- Each time we restart the app, whether manually or with `nodemon`, it loses any data that we added.
- There's no way to distinguish between the different users (the browsers) since every HTTP request/response cycle accesses and shares the data stored in the `contactData` object. Only one instance of `contacts.js` is running, so every request/response cycle uses that instance.

How we implement persistence through the use of sessions

- Data persistence requires a **data store** of some kind, usually based on databases or other files on the server. 
- User authentication -- the ability for different users to log in to an application -- also requires a data store. 
- While we're not yet ready to discuss databases, we'll use a NoSQL database in this assignment. The process is mostly invisible.

### `express-session` and `connect-loki`

`express-session`

- `express-sesion` is a module that provides the features we need to manage sessions. 
  - This module also takes care of handling cookies, so we don't have to install anything special.
  - If you search the Web for `express-session`, you may turn up pages that say it must use the `cookie-parser` module. This information is outdated. It handles cookies without that module.
- `express-session` provides a default data store called `MemoryStore`, which is usually all you need during development. 
  - However, it doesn't persist data across restarts of the application or browser restarts. It is intended for development only. Don't use it in production environments. 
  - The `express-session` [documentation](https://www.npmjs.com/package/express-session) includes a list of compatible data stores (it calls them session stores).

Sensitive data

- The `session-store.db` should be treated as sensitive data. You should not push it to a public location, such as your Github repository. To prevent that from happening, be sure to list `session-store.db` in your `.gitignore` file (create it if you'd don't already have one):

.gitignore

```git
# Existing entries, if any, omitted

session-store.db
```

- If you accidentally push the `session-store.db` file to a remote repo, [removing it](https://help.github.com/en/github/authenticating-to-github/removing-sensitive-data-from-a-repository) completely is difficult. Sensitive data, once pushed to Github, must be treated as compromised data.

`connect-loki`

- For the data store, we can use the `connect-loki` module. It uses a NoSQL database to persist data. By default, it stores the database in the `session-store.db` file in your project directory. 
- Best of all, `connect-loki` doesn't require a lot of complicated software installation and configuration -- installing it via `npm` is all you need.
- `connect-loki` lets `express-session` use a NoSQL database as the session data store.

### How do sessions work?

- The `express-session` module provides the tools you need to write Express programs that can keep track of multiple data sets.
- The `express-session` module generates a unique session ID whenever a client browser makes an initial HTTP request to our application. 
  - It uses the session ID to identify that client in future requests.
  - The app stores any data it needs to persist under the session ID and sends the session ID to the client in a cookie. 
  - After that, the browser sends this cookie back to the server as part of each subsequent request. The application can then use the returned cookie to obtain the session ID and look up the stored data.
- Session persistence is not the same as a central database
  - Session persistence typically provides a means to persist user-specific data, while a central database offers centralized storage for both shared and user-specific data. 
  - Furthermore, a central database can be thought of as permanent storage, while session data is more transient or temporary.
- What *permanent* storage means
  - A database is permanent in the sense that it resides on a device that won't lose the data if the application or hardware is shut down or when a cookie expires or gets lost. The information isn't dependent on a session ID.
  - Instead, it's either shared amongst all users or restricted to users that have authenticated themselves to the application. That data can change -- we can even delete it -- but it's still said to be in permanent storage.
- Why session data is temporary
  - session data is entirely dependent on the session ID. If the user somehow loses that session ID, they're in trouble. They won't be able to access the data without the session ID. 
  - There are lots of ways in which a session ID can go missing:
    - The session cookie expired.
    - The user is using a different browser or computer.
    - A browser or system error may have wiped out the browser's cookie store.
    - The server may have lost the session ID somehow.
- In this project, we use session persistence in an atypical manner. 
  - Ideally, our contact lists should be in permanent storage. 
  - Since we're using sessions, the contacts that each user sees depend on the session ID stored in their browser's cookie store. If the cookie expires or the user moves to another browser, they should see different data.

### Getting ready to use sessions

- Install

  ```terminal
  $ npm install connect-loki --save
  ```

- Don't forget to treat the `session-store.db` file as sensitive data. You should add it to your `.gitignore` file before pushing it to Github.

  .gitignore

  ```git
  # Existing entries, if any, omitted
  
  session-store.db
  ```

- `require` the external module in our application to inform Express that it needs to use the module. With `express-session` and `connect-loki`, our setup code looks like this

  ```js
  // todos.js
  const store = require("connect-loki");
  
  const app = express();
  const LokiStore = store(session);
  ```

- Configure the session cookie

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

- Note: The `next()` function is not explicitly used in this middleware because this specific middleware does not perform any custom logic that would require passing control to the next middleware or route handler.

<u>What those session properties mean</u>

In the call to the `session` function, the `cookie` property is an object that describes the characteristics of the session cookie. In particular, the nested properties do the following:

- `httpOnly` is a security-related setting. When `true`, this property tells the browser that it isn't allowed to alter the value of the cookie. It also prevents JavaScript from accessing the cookie at all. It should usually be `true` with sensitive cookies, such as one that contains the session ID.

- `maxAge` specifies the maximum lifetime of the cookie, in milliseconds. If not specified, the cookie's lifetime is only as long as the browser continues to run. When the browser is shut down, all cookies with no specified lifetime get deleted.

- `path` specifies the document location for the cookie. The browser sends a cookie to the server only when the URL it needs to request matches this path. For instance, a cookie with `path: '/foo'` would only be sent to the server when requesting `/foo`, `/foo/edit`, `/foo/3/bar/33`, and so on. It would not send it if the browser were requesting `/bar` or `/bar/foo`.

- When `secure` is `true`, the browser should only transmit the cookie over secure HTTPS connections. When `false`, the browser can send the cookie over both HTTPS and HTTP connections.

The `name` property provides a session name for sessions created by this application. Express-Session uses the `name` property to name a cookie that contains the session ID. It isn't required, but you should always provide one. The name should be unique on the server that hosts your application.

The `secret` property is required. `express-session` uses it to sign and encrypt the session cookie to prevent tampering.

The `secret` value is sensitive data that needs protection from prying eyes. Including it in the source code -- as we do here -- isn't safe. However, it is simple, and since our application only listens for connections on the localhost, the risk is minuscule. However, were we to make the app public, the risk would be grave. In most applications, you should obtain the `secret` value from an external source that is only available to your servers, such as a database or a local file.

The `store` property defines the data store that `express-session` should use. It's an object of the store type we're using: in this case, `LokiStore`.

You should always provide the remaining two properties, `resave` and `saveUninitialized`. They both have default values, but the defaults are in the process of being changed. In most cases, you can set them to `false` and `true`, respectively. See the [express-session documentation](https://www.npmjs.com/package/express-session) for more information. 

### Preparing the session data store

### Moving data to the session store

### Clearing cookies



# Pug 

## Pug Documentation

[Pug](https://pugjs.org/api/getting-started.html)

- The Language Reference(right-hand side) is best source of information.
- Most of it is "by example" rather than in-depth explanations, so you may have to do some experimentation to understand how things work.
- The most useful reference sections cover the following topics:
  - Attributes
  - Code
  - Conditionals
  - Inheritance: Extends and Block
  - Interpolation
  - Iteration
  - Plain Text
  - Tags

#### Documentation Notes

- Pug is a templating engine which means it provides a way to generate dynamic HTML markup by combing static HTML with dynamic content.
- It is a templating engine for Node.js. It is used to simply the creation of HTML templates with concise syntax. Pug is not a programming language but a markup language that compiles into HTML. 
- Like other templating engines, it has a `compile()` method that compiles the Pug source code into a JavaScript function that takes a data object(called "`locals`") as an argument. Call that function with your data, and it will return a string of HTML rendered with your data. 

## Resources

- the [online Pug to HTML converter](https://pughtml.com/). It also converts HTML back to Pug.

## Notes

### Why pug? Dynamic content

- Pug, like other templating engines, allows for dynamic content generation whereas standard HTML is static by nature.
- **Conditionals**: Pug lets you control what gets rendered based on conditions (`if`, `else`, etc.), allowing for dynamic content that changes based on variables or application state.
- **Loops**: You can iterate over arrays or objects to generate repetitive structures dynamically.
- **Variables**: Pug supports the use of variables, which can be passed into the template and used to render dynamic data.
- **Expressions**: You can embed JavaScript expressions directly within the Pug template to modify content dynamically.

### **HTML and Static Content:**

- **No Logic or Conditions**: HTML is purely a markup language. It doesn't include any logic, conditionals, loops, or variables.
- **Predefined Structure**: HTML content is static and predefined. If you want to change the content or structure, you need to either write new HTML or use external tools like JavaScript, templating engines, or server-side rendering.
- **Dynamic Content Through External Tools**: You can make HTML dynamic by combining it with JavaScript, server-side scripts, or frameworks, which manipulate the DOM or generate HTML based on the logic provided.

### installing pug

- First we need to install Pug:

  ```terminal
  $ npm install pug --save
  ```

- Note that we're installing Pug as part of the overall application, *not as a development* package.

### Adding pug support

- First we need to tell Express that it should use the Pug view engine, and where it should look for view templates required by the program.

hello.js

```js
const express = require("express");
const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("hello-world-english");
});

app.listen(3000, "localhost", () => {
  console.log("Listening to port 3000.");
});
```

- Line 4 tells Express that it should look for view templates in the `views` directory of the project folder

- Make the `views` directory project folder now. 

  ```terminal
  $ mkdir views
  ```

- Line 5 tells Express to use the Pug view engine. There are about 2 dozen view engines listed on the Express website as of this writing, with Pug at the top of the list.

- Line 8 uses `res.render` instead of `res.send`. This new method renders the view template file `hello-world-english.pug` by converting it to HTML and sending it to the client; typically, that's your browser.

### Syntax

##### `=` 

- `=` character at the end of a tag name treats the content after it as an expression. 

  ```pug
   td= contact.phoneNumber
  ```

- When you append an `=` to a tag name, e.g., `h2=`, everything to the right is treated as a JavaScript expression. Pug evaluates the expression, and uses the return value (after coercion to a string) as the value passed to the tag.

- For instance

  ```jade
  h2= todoList.title
  ```

  is equivalent to:

  ```jade
  h2 Work Todos
  ```

### Indentation

- In Pug, the level of indentation determines the parent-child relationship between elements. An element that is indented under another is considered a child of the previous element.

- Example of pug and html

  ```pug
  html
    head
      title My Page
    body
      h1 Welcome to My Page
      p This is a paragraph.
  
  ```

  ```html
  <html>
    <head>
      <title>My Page</title>
    </head>
    <body>
      <h1>Welcome to My Page</h1>
      <p>This is a paragraph.</p>
    </body>
  </html>
  ```

- Note that indentation is important in Pug; the Tags section briefly mentions this. For instance, consider these two examples:

- Example 1

  ```html
  p Four score and
    em seven
      strong years
        b ago
  ```

- Example 2

  ```html
  p Four score and
  em seven
  strong years
  b ago
  ```

- These two examples produce very different HTML:

  - Example 1 (Generated HTML)

    ```html
    <p>Four score and<em>seven<strong>years<b>ago</b></strong></em></p>
    ```

  - Example 2 (Generated HTML)

    ```html
    <p>Four score and</p><em>seven</em><strong>years</strong><b>ago</b>
    ```

Pug doesn't format HTML nicely

- Note, though, that Pug doesn't format the HTML nicely. Instead, it writes most of its HTML output as a single line with only required whitespace.

### Views

- Pug files in the `views` folder are called "views", which are templates.

### Layouts  and blocks

- A **Layout** is a boilerplates. It is a pug view template that other Pug templates can extend. In effect, other Pug templates can inherit and override the content of a layout template.
- `block` command: `block` helps define the structure of a web page by specifying areas where content can be injected. 
  - This makes it possible to create a common layout ( like a header and footer) and customize the content in different parts of the website.

- Other templates use `extends` to extend from the layout file.

Example

- Say we have a `layout.pug` and `my-view.pug`. 

  views/layout.pug

  ```jade
  doctype html
  html(lang="en-US")
    head
      title My App
      meta(charset="UTF-8")
    body
      header
        block my_header
          p This is My Header
      main
        block my_content
          p This page intentionally left blank.
      footer
        block my_footer
          p Copyright Launch School &copyr; 2019
  ```

  views/my-view.pug

  ```jade
  extends layout
  
  block my_content
    p Sint nulla sunt fugiat consectetur. Non elit dolore proident commodo.
    p In fugiat tempor anim cupidatat incididunt ea id.
    p Occaecat reprehenderit incididunt laborum minim cupidatat.
  
  block my_footer
    p Copyright Me &copyr; 2019
  ```


##### How layouts work

- So pretty much if the layout has a matching block with a Pug view template, the layout is interjected with the matching block's contents, and the rest of the indented layout values ***<u>are ignored</u>*** for that block. 
- If the layout does not have a matching block with Pug view template, Pug uses the indented layout content. 

- The final Pug view is effectively this code

  ```pug
  doctype html
  html(lang="en-US")
    head
      title My App
      meta(charset="UTF-8")
    body
      header
        p This is My Header
      main
        p Sint nulla sunt fugiat consectetur. Non elit dolore proident commodo.
        p In fugiat tempor anim cupidatat incididunt ea id.
        p Occaecat reprehenderit incididunt laborum minim cupidatat.
      footer
        p Copyright Me &copyr; 2019
  ```

What happens as Express tries to render `my-view.pug`

- Pug sees the `extends layout` command and loads the contents of `layout.pug`. 
- If then begins rendering the layout as HTML. When Pug encounters a `block ` command, it looks for a corresponding `block` header in `my-view.pug`. 
- If it can't find one, it goes back to the layout and uses the indented content beneath the `block` command in layout. So in our example, Pug would render `p This is my Header` as HTML since there is no `block my_header` in `my-view.pug`.
- But if the original Pug view does have a matching block, Pug replaces the content specified by the layout with the contents of the block from the original template.

##### When to use layouts

Reducing maintenance costs with layouts

- When you have a large number of files that all have a similar structure, you can use layouts to extract much of the repetitive code into a single location. That, in turn, simplifies your other views and reduces your overall maintenance costs (you don't have to make changes in multiple places).
- Use layout to remove repetition in templates.

- Let's see how we can use this in our "Hello World" application.

What to keep and what to discard from layout

- There's no one right way to choose what to keep and what to discard from the layout. 
- The general idea is that the layout template provides all or most of the shared code. However, it's possible to move too much code into the layout. 

### Interpolation

##### References

- [Pug Interpolation](https://pugjs.org/language/interpolation.html) and [Pug Attributes](https://pugjs.org/language/attributes.html) pages. Refer to them as needed.

##### Interpolating expressions into `class` attributes

- Pug allows you to use JavaScript expressions directly in attributes. This can make it easier to create dynamic and flexible HTML.

- This means we can access variables when defining `class` attributes. 

- Pug lets us use JavaScript expressions in place of class names. The expressions are **interpolated** (evaluated and converted to a string, then replaced by the resulting value). 

- Use a **template literal** for a **dynamic attribute value**: 

  ```jade
  a(href=`/todos/${todoId}/edit`)
  ```

  This is equivalent to the following JavaScript expression

  ```jade
  a(href="/todos/" + String(todoId) + "/edit"
  ```
  
  Either way, the value is coerced to a string.

##### Appending `=` to a tag name

- When you append an `=` to a tag name in Pug, it tells Pug that everything to the right of the `=` is a JavaScript expression. Pug evaluates this expression and uses the result as the content or value for the tag.

- For instance, if `todoList.title` returns `"Work Todos"`, then:

  ```jade
  h2= todoList.title
  ```

  is equivalent to:

  ```html
  <h2>Work Todos</h2>
  ```

##### Interpolation of ordinary text

- The `#{...}` form of interpolation comes into play when we pass ordinary text content to an element.

  ```pug
  td #{contact.lastName}
  ```

- If you don't append an `=` to a tag name, then JavaScript code must be wrapped inside `#{...}`. This is similar to JavaScript's template literal syntax, but uses `#` instead of `$`.

- Pug evaluates the `#{...}` expressions, and replaces them with the return value, coerced to a string if needed.

##### Interpolation of JavaScript expression

- use `${...}` when you need to provide a JavaScript expression.

### view variables & view helpers

- View variables and view helpers can extract navigation links into layout.

- **View variables**: Variables that are passed into views through the route callbacks. The view engine can use those variables to render dynamic content. 
  - Most templating engines like Pug allow route callbacks to pass variables into the views. 
  - In express.JS, the variables are called view variables.
  - View variables are created in pug views when we pass an object to `res.render()`'s second argument, which sets the properties and values as view variables in the pug view.
- **View helper functions**: View helpers are ordinary JavaScript functions defined on the `app.locals` or `res.locals` objects provided by Express. 
  - Because every view can access the properties of the `app.locals` object, it's a good place to define view helpers as properties on that object.
  - They are complex operations defined by the application that the view engine can call while rendering the code into HTML. 
  - Most templating engines can also call view helper functions defined by the application.
  - Express.JS also provides this capability. 
- View variables or Helpers?
  - Use view helpers only when you have two or more views that need the same helper. Otherwise, perform the necessary calculations before rendering the view template, then pass it the value as a variable.
    - In our example, we used view helper from the layout --> which is needed for multiple views so it's ok to define a view helper function. 
  - If you must call a function from the view, define it as a method on the object passed as the second argument to `res.render`. Technically, functions passed directly to `res.render` aren't called view helpers.
  - For many simple cases, variables are more than enough. However, you sometimes need to think about the future. In our variable-based approach to the navigation links, we decided that view variables were more trouble than they're worth - adding dozens of view variables for different languages can get out of hand.

- `app.locals` vs `res.locals`
  - We add view helpers as properties on `app.locals` because `app.locals` only needs to be set once, whereas `res.locals` properties need to be set for every response. 
  - If required, we can use `res.locals` to store variables during the current request/response cycle. However, it's usually better to define such variables in the second argument passed to `res.render`. 
  - Use `res.locals` for passing variables between middleware functions instead. (That's a topic for later.)

------

##### Creating view variables

- When we pass an object as `res.render`'s 2nd argument, it creates **view variables** in the Pug view whose names and values match the property names and values defined by the object. 

------

##### Messy Example using only view variable

- Pug receives a variable `currentLinkIsEnglish` with the value `"current"` when we render `hello-world-english.pug`.

- Once we've defined those variables in our route callbacks, we can access them in Pug. Let's try it with `hello-world-english.pug` first:

- The `currentLinkisEnglish` is the view variable.

  ```js
  app.get("/english", (req, res) => {
    res.render("hello-world-english", {currentLinkIsEnglish: "current"});
  });
  ```

- This allows for all the view Pug files to have the same code for the `navigation_link` blocks.

- This approach is messy because we have to define a new variable name for every possible destination in the navigation bar.

------

##### Better example using view helper

- A better approach is to pass the current path (e.g., `/french`) as the **view variable** to the view and use a view helper to determine which link needs the `current` class name. 
- **View helpers** are ordinary JavaScript functions defined on the `app.locals` or `res.locals` objects provided by Express. (Using `res.locals` for helpers is atypical; use `app.locals` in most cases.) Because every view can access the properties of the `app.locals` object, it's a good place to define view helpers. 

hello.js

```js
// - view helper function is called by the layout view to determine whether a link is to the current page.
// - Argument 1: path associated with link, argument 2: current path
// - Only one link gets assigned to the current class.
app.locals.curentPathClass = (path, currentPath) => {
  return path === currentPath ? "current" : "";
}
```

```js
app.get("/english", (req, res) => {
  res.render("hello-world-english", {
    currentPath: req.path,
  });
});

app.get("/french", (req, res) => {
  res.render("hello-world-french", {
    currentPath: req.path,
  });
});

app.get("/serbian", (req, res) => {
  res.render("hello-world-serbian", {
    currentPath: req.path,
  });
});
```

layout.pug

- `currentPathClass` is a helper function that is called by the layout view to be evaluated and assigned to a `class` attribute. 

```pug
doctype html

html(lang="en")
  head
    block page_title
      title This is the page title
    meta(charset="UTF-8")
    link(rel="stylesheet" href="/stylesheets/application.css")

  body
    nav
      ul
        li
          a(href="/english" class=currentPathClass("/english", currentPath))
            img.flag(src="/images/flag-of-United-States-of-America.png"
                    alt="US Flag"
                    title="Go to US English site")
        li
          a(href="/french" class=currentPathClass("/french", currentPath))
            img.flag(src="/images/flag-of-France.png"
                    alt="Drapeau de la france"
                    title="Aller sur le site français")
        li
          a(href="/serbian" class=currentPathClass("/serbian", currentPath))
            img.flag(src="/images/flag-of-Serbia.png"
                    alt="Застава Србије"
                    title="Идите на српски сајт")
        li 
          a(href="/chinese" class=currentPathClass("/chinese", currentPath))
            img.flag(src="images/flag-of-China.png"
                    alt="中国国旗"
                    title="去中文网站")

    header
      block greeting
        h1 Hello World!

    main
      block software_engineer
```

### Loops in Pug

- Pug lets us write loops with the `each` and `while` statements, which eliminates duplicate code in the layout file.

#### Array Iteration in Pug

- We can pass an array to a Pug view and iterate over it.
- We can pass the array into the view by adding a property, with the array as that property's value, to the  to the object passed as the second argument to `res.render`. 

```js
const array = [1, 2, 3];
res.render("view_template", {
  numbers: array,
});
```

- In our view, we can use `each` to iterate over the array.

```jade
body
  ul
    each number in numbers
      li= number
```

This code results in an unordered list of arbitrary numbers. The resulting HTML should look something like this (albeit more condensed):

```html
<body>
  <ul>
    <li>1</li>
    <li>13</li>
    <li>5</li>
    <li>27</li>
    <li>45</li>
  </ul>
</body>
```

- You can also access the indexes from the `each` loop:

```jade
body
  ul
    each number, index in numbers
      li `${index}: ${number}`
```

That code leads to this HTML:

```html
<body>
  <ul>
    <li>0: 1</li>
    <li>1: 13</li>
    <li>2: 5</li>
    <li>3: 27</li>
    <li>4: 45</li>
  </ul>
</body>
```

#### Looping Over Objects

##### Example

We can create an array of objects in our `hello.js` program, each of which should include the information we need for that element:

- The path (`/english`, `/french`, `/serbian`)
- The image filename
- The text for the `alt` and `title` attributes of the `img` tag

That should be straightforward:

hello.js

```js
// Put this code after `const app = express()`

const COUNTRY_DATA = [
  {
    path: "/english",
    flag: "flag-of-United-States-of-America.png",
    alt: "US Flag",
    title: "Go to US English site",
  },
  {
    path: "/french",
    flag: "flag-of-France.png",
    alt: "Drapeau de la france",
    title: "Aller sur le site français",
  },
  {
    path: "/serbian",
    flag: "flag-of-Serbia.png",
    alt: "Застава Србије",
    title: "Идите на српски сајт",
  },
];
```

We can now pass that data into the different views:

hello.js

```js
app.get("/english", (req, res) => {
  res.render("hello-world-english", {
    countries: COUNTRY_DATA,
    currentPath: req.path,
    language: "en-US",
  });
});

app.get("/french", (req, res) => {
  res.render("hello-world-french", {
    countries: COUNTRY_DATA,
    currentPath: req.path,
    language: "fr-FR",
  });
});

app.get("/serbian", (req, res) => {
  res.render("hello-world-serbian", {
    countries: COUNTRY_DATA,
    currentPath: req.path,
    language: "sr-Cyrl-rs",
  });
});
```

Finally, we can update our layout to use the navigation data in a loop:

views/layout.pug

```jade
body
  nav
    ul
      each country in countries
        li
          a(href=country.path
            class=currentPathClass(country.path, currentPath)
          )
            img.flag(src=`/images/${country.flag}`
                     alt=country.alt
                     title=country.title)
```

What this code does

- In this code we loop over each object in countries, which is a variable that references in an array of objects. That array of objects was originally was passed through  `res.render()`. 
- When we pass an object as the second argument through `res.render()`, the properties on that object become variables in the pug views.

# Sessions & Persistance

- Our goal for contact manager is to use different data depending on which browser we're using. From the perspective of our application, different browsers appear to be different users.
- The `express-session` module generates a unique session ID whenever a client browser makes an initial HTTP request to our application. 
  - It uses the session ID to identify that client in future requests.
  - The app stores any data it needs to persist under the session ID and sends the session ID to the client in a cookie. 
  - After that, the browser sends this cookie back to the server as part of each subsequent request. The application can then use the returned cookie to obtain the session ID and look up the stored data.
- Session persistence is not the same as a central database
  - Session persistence typically provides a means to persist user-specific data, while a central database offers centralized storage for both shared and user-specific data. 
  - Furthermore, a central database can be thought of as permanent storage, while session data is more transient or temporary.
- What *permanent* storage means
  - A database is permanent in the sense that it resides on a device that won't lose the data if the application or hardware is shut down or when a cookie expires or gets lost. The information isn't dependent on a session ID.
  - Instead, it's either shared amongst all users or restricted to users that have authenticated themselves to the application. That data can change -- we can even delete it -- but it's still said to be in permanent storage.
- Why session data is temporary
  - session data is entirely dependent on the session ID. If the user somehow loses that session ID, they're in trouble. They won't be able to access the data without the session ID. 
  - There are lots of ways in which a session ID can go missing:
    - The session cookie expired.
    - The user is using a different browser or computer.
    - A browser or system error may have wiped out the browser's cookie store.
    - The server may have lost the session ID somehow.
- In this project, we use session persistence in an atypical manner. 
  - Ideally, our contact lists should be in permanent storage. 
  - Since we're using sessions, the contacts that each user sees depend on the session ID stored in their browser's cookie store. If the cookie expires or the user moves to another browser, they should see different data.

# Express application & Pug

## Placeholders for rendering view

Q: How do I know what local variables I need to render this view extends layout?

```pug
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

A: To determine the local variables you need to render this view, you should look at the dynamic data that this view is utilizing. In the given Pug template, there are placeholders (variables) that are being used to render dynamic content. Let's identify those placeholders and understand what data needs to be provided for rendering this view:

1. **`todoList` Object:**
   - The view uses properties of the `todoList` object, such as `todoList.isDone()`, `todoList.title`, `todoList.id`, and `todoList.size()`.
   - You'll need to provide a `todoList` object to render this view, containing the necessary data like title, ID, completion status, and the list of todos associated with it.
2. **`todos` Array:**
   - The `each todo in todos` loop iterates over the `todos` array, applying properties such as `todo.isDone()`, `todo.title`, and `todo.id`.
   - You'll need to provide an array of `todos` to render the individual todo items in the view.
3. **`todoTitle` String:**
   - The `value=todoTitle` attribute in the new todo input field implies that this view expects a `todoTitle` string to populate the input field's value.
   - Provide the `todoTitle` string when rendering the view to pre-fill the input field if necessary.

With this information, here's how you can set up the local variables when rendering the view (assuming you're using Express.js and Pug):

```
javascriptCopy codeapp.get('/your-route', (req, res) => {
  // Your logic to fetch data goes here
  const todoList = {...}; // Provide the todoList object
  const todos = [...];    // Provide the todos array
  const todoTitle = '';   // Provide the todoTitle string

  res.render('your-view', {
    todoList,
    todos,
    todoTitle
  });
});
```

Replace the placeholders like `todoList`, `todos`, and `todoTitle` with the actual data you have or fetch from your database or other data sources. Ensure that the structure of the data matches what the view expects.
