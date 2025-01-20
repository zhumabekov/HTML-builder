const fs = require('fs');
const path = require('path');

function copyDir(){
    fs.mkdir(path.join(__dirname, "files-copy"), (err) => {
        if (err) throw err;
    });

    fs.readdir(path.join(__dirname, "files"), (err, files) => {
        if (err) throw err;
      
        files.forEach((file) => {
            copyFile(file);
        });
    });
}

function copyFile(fileName){
    fs.copyFile(path.join(__dirname, "files", fileName), path.join(__dirname, "files-copy", fileName), (err) => {
        if (err) {
          console.error('Error copying file:', err);
        } else {
          console.log('File copied successfully!');
        }
    });
}
copyDir()