const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, "secret-folder");

fs.readdir(folderPath, (err, files) => {
    if (err) throw err;
  
    files.forEach((file) => {
      getFileInfo(file);
    });
});

async function getFileInfo(fileName){
    const filePath = path.join(folderPath, fileName);

    const stats = await fs.promises.stat(filePath);
    if (stats.isFile()) {
        const fileNameData = path.parse(filePath);
        const fileSizeData = await fs.promises.stat(filePath);

        console.log(`${fileNameData.name} - ${fileNameData.ext.slice(1)} - ${fileSizeData.size} byte`);
    }else{
        return;
    }
}