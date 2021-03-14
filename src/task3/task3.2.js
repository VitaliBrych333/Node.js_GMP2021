import fs from 'fs';
import csv from 'csvtojson';

const csvFilePath = 'files/nodejs-hw1-ex1.csv';
const readStream = fs.createReadStream(csvFilePath); 

readStream
  .pipe(
    csv({
      delimiter: [";"],
      headers: ['book', 'author', 'amount', 'price'],
      ignoreColumns: /(Amount)/,
      colParser: {
        'price': (str) => parseFloat(str.replace(',','.')),
      }
    })
  )
  .on('data', (data) => {
    try {
      const line = JSON.stringify(JSON.parse(data), ['book', 'author', 'price']);
      console.log('New line: ', line)
      fs.appendFileSync('output.txt', line + '\n', 'utf8');
    }
    catch(err) {
      console.log('Can not write: ', err);
    }
  })
  .on('error', (err) => {
    console.log('Can not read: ', err);
  })
  .on('end', () => {
    console.log('End: ');
  });
