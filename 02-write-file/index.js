const fs = require('fs');
const path = require('path');
const { stdout, stdin } = process;
const fileName = '02-write-file.txt';

fs.open(path.join(__dirname, fileName), 'w', function (err, file) {
    if (err) throw err;
});
stdout.write('Enter text: ');

stdin.on("data", (data) => fs.appendFile(
    path.join(__dirname, fileName),
    data,
    (err) => {
      if (err) throw err;
      console.log("The text is recorded in the file, you can add more text: ");
    },
));

process.on("SIGINT", closeInput); 

function closeInput() {
    stdout.write("Good luck!");
    process.exit(0);
}