const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const reverseString = (str) => {
  let newString = '';
  for (let i = str.length - 1; i >= 0; i--) {
    newString += str[i];
  }
  return newString;
};

const reverse = () =>
  rl.question('Please enter a value: ', (val) => {
    console.log('Reversed value:', reverseString(val));
    reverse();
  });

reverse();