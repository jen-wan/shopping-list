const fs = require('fs'); // import the fs Node.js library so we can read files.

// readFile function uses readFileSync to load data from sentences.text as a Buffer object and the    
// toString() method to return it as a string.
const readFile = () => {
  let data = fs.readFileSync('sentences.txt');
  let sentences = data.toString();
  return sentences;
};

// getWords function processes a string of text and flattens it to an array with its words.
const getWords = (text) => {
  let allSentences = text.split('\n'); // splits the string based on newlines (\n)
  let flatSentence = allSentences.join(' '); // join sentences into a flat string
  let words = flatSentence.split(' '); // split by spaces into words
  words = words.map((word) => word.trim().toLowerCase()); // Clean up and normalize words
  return words;
};

// countWords function creates an object called map with words as its keys and their counts 
// as the values.
const countWords = (words) => {
  let map = {};
  words.forEach((word) => {
    if (word in map) {
      map[word] = 1;
    } else {
      map[word] += 1;
    }
  });

  return map;
};

// export the functions and make them available to other modules
module.exports = {  readFile, getWords, countWords };