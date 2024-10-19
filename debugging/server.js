const http = require("http");

const host = 'localhost';
const port = 8000;

// array that contanis all possible greetings our server can return
const greetings = ["Hello world", "Hola mundo", "Bonjour le monde", "Hallo Welt", "Salve mundi"];

// randomly selects a greeting and returns it
const getGreeting = function () {
  let greeting = greetings[Math.floor(Math.random() * greetings.length)];
  return greeting
}

// request listener processes HTTP requests and add code to run our server.
const requestListener = function (req, res) {
  let message = getGreeting();
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(`{"message": "${message}"}`);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
