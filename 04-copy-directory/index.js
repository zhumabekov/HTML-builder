const fs = require('fs/promises');
const path = require('path');

async function copyDir(srcDir, destDir) {
    try {
        await fs.rm(destDir, { recursive: true, force: true });
        await fs.mkdir(destDir, { recursive: true });
        const files = await fs.readdir(srcDir, { withFileTypes: true });

        for (const file of files) {
            const srcPath = path.join(srcDir, file.name);
            const destPath = path.join(destDir, file.name);
            if (file.isDirectory()) {
                await copyDir(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
        console.log("Копирование завершено!");
    } catch (err) {
        console.error("Ошибка при копировании:", err);
    }
}

async function main() {
    const srcDir = path.join(__dirname, 'files');
    const destDir = path.join(__dirname, 'files-copy');
    await copyDir(srcDir, destDir);
}

main();
