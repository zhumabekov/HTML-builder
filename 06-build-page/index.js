const fs = require('fs');
const path = require('path');
const distPath = path.join(__dirname, "project-dist")

fs.mkdir(distPath, (err) => {
    if (err) throw err;
    console.log("Folder was created");
});

function copyCss(){
    const devCssPath = path.join(__dirname, "styles");
    readDir(devCssPath);
}
function readDir(devPath){
    fs.open(path.join(distPath, 'style.css'), 'w', function (err, file) {
        if (err) throw err;
    });
    fs.readdir(devPath, (err, files) => {
        if (err) throw err;
      
        files.forEach((file) => {
            readFile(file, devPath);
        });
    });
}
function readFile(fileName, devPath){
    let currentFilePath = path.join(devPath, fileName);
    
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
        path.join(distPath, 'style.css'),
        data,
        (err) => {
          if (err) throw err;
          console.log("File was modified");
        },
    )
}


async function copyDir(pathName){
    fs.mkdir(path.join(distPath, pathName), (err) => {
        if (err) throw err;
    });

    fs.readdir(path.join(__dirname, pathName), (err, files) => {
        if (err) throw err;
      
        files.forEach((file) => {
            const filePath = path.join(folderPath, file);
            // const stats = await fs.promises.stat(filePath);
            if (stats.isFile()) {
                copyFile(file);
            }else{
                copyDir(file)
            }
        });
    });
}

function copyFile(fileName){
    let devPath = path.join(__dirname, "assets");
    let prodPath = path.join(distPath, "assets");
    fs.copyFile(path.join(devPath, fileName), path.join(prodPath, fileName), (err) => {
        if (err) {
          console.error('Error copying file:', err);
        } else {
          console.log('File copied successfully!');
        }
    });
}

function replaceTemplate(){
    const filePath = path.join(__dirname, 'template.html');
    const folderPath = path.join(__dirname, 'components');

    let templateHTML
    fs.readFile(
        filePath,
        "utf-8",
        (err, data) => {
          if (err) throw err;
          templateHTML = data;
        },
    );
    let articlesHTML = fs.readFile(
        path.join(folderPath, 'articles.html'),
        "utf-8",
        (err, data) => {
          if (err) throw err;
          return data;
        },
    );
    let footerHTML = fs.readFile(
        path.join(folderPath, 'footer.html'),
        "utf-8",
        (err, data) => {
          if (err) throw err;
          return data;
        },
    );
    let headerHTML = fs.readFile(
        path.join(folderPath, 'header.html'),
        "utf-8",
        (err, data) => {
          if (err) throw err;
          return data;
        },
    );

    let updatedData = templateHTML.replace(new RegExp('{{header}}', 'g'), headerHTML);
    updatedData = updatedData.replace(new RegExp('{{articles}}', 'g'), articlesHTML);
    updatedData = updatedData.replace(new RegExp('{{footer}}', 'g'), footerHTML);

    fs.writeFile(distPath, updatedData, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log('Замена успешно выполнена.');
    });
}
copyCss()
// copyDir('assets')
replaceTemplate()
