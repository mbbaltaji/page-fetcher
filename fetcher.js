const request = require('request');
const readline = require('readline'); // readline from stdin
const fs = require('fs'); //to write to a file

// rl will accept input from stdin and output to stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const args = process.argv.slice(2);
const url = args[0];
const file = args[1];

// function that makes a HTTP request
const fetchURL = function() {
  request(url, (error, response, body) => {
    if (error) {
      console.log('Problem reaching URL: ', error);
      process.exit();
    }
    checkFile(body);
  });
};

/**
 * function that checks whether a file already exists. If file exits,
 * ask user if they want to overwrite it. Otherwise terminate.
 *  @param {String} body
 */
const checkFile = function(body) {
  if (fs.existsSync(file)) {
    rl.question(`${file} already exists, would you life to overwrite the file? (press y to overwrite): `, (answer) => {
      if (answer.toLowerCase() === 'y') {
        writeToFile(body); // write data to file if the answer is y
        rl.close();
      } else {
        process.exit(); // otherwise terminate program
      }
    });
  } else {
    // if file name is wrong or the file does not exist
    console.log(`Wrong file name ${file} or file does not exist. Aborting...`);
    process.exit();
  }
};

/**
 * Function that writes HTTP data to a file
 * @param {String} body
 */
const writeToFile = function(body) {
  fs.writeFile(file, body, (err) =>{
    if (err) console.log(err);
    console.log(`Downloaded and saved ${body.length} bytes to ${file}`);
  });
};

fetchURL();




