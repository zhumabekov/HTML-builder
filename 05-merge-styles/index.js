const fs = require('fs');
const path = require('path');
const srcPath = path.join(__dirname, "styles");
const distPath = path.join(__dirname, "project-dist")
const fileName = "bundle.css"

fs.open(path.join(distPath, fileName), 'w', function (err, file) {
    if (err) throw err;
});

function readDir(){
    fs.readdir(srcPath, (err, files) => {
        if (err) throw err;
      
        files.forEach((file) => {
            readFile(file);
        });
    });
}
function readFile(fileName){
    let currentFilePath = path.join(srcPath, fileName);
    
    if (path.extname(fileName) === '.css'){
        fs.readFile(
            currentFilePath,
            "utf-8",
            (err, data) => {
              if (err) throw err;
              writeFile(data);
            },
        )
    }
}
function writeFile(data){
    fs.appendFile(
        path.join(distPath, fileName),
        data,
        (err) => {
          if (err) throw err;
          console.log("File was modified");
        },
    )
}
readDir()