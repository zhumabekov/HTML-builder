const fs = require('fs');
const path = require("path");

const textLink = path.join(__dirname, "text.txt");
const readableStream = fs.createReadStream(textLink);

readableStream.pipe(process.stdout);
