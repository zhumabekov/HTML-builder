const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const fileName = '02-write-file.txt';

const filePath = path.join(__dirname, fileName);
const writableStream = fs.createWriteStream(filePath);

console.log('Enter text: ');
stdin.on('data', (data) => {
  if (data.toString().trim().toLowerCase() === 'exit') {
    endSession();
  }

  writableStream.write(data);
});

process.on('SIGINT', endSession);

function endSession() {
  stdout.write('\nGood luck!\n');
  writableStream.end();
  process.exit();
}
