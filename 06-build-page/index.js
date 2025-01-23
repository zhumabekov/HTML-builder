const fs = require('fs/promises');
const path = require('path');

async function buildPage() {
    const projectDist = path.join(__dirname, 'project-dist');
    const templatePath = path.join(__dirname, 'template.html');
    const componentsDir = path.join(__dirname, 'components');
    const stylesDir = path.join(__dirname, 'styles');
    const assetsDir = path.join(__dirname, 'assets');

    try {
        await fs.mkdir(projectDist, { recursive: true });
        let template = await fs.readFile(templatePath, 'utf-8');
        const tagsArray = [...new Set(template.match(/{{(.*?)}}/g)?.map(tag => tag.slice(2, -2).trim()))];
        for (const tag of tagsArray) {
            const componentPath = path.join(componentsDir, `${tag}.html`);
            const content = await fs.readFile(componentPath, 'utf-8');
            template = template.replace(`{{${tag}}}`, content);
        }
        await fs.writeFile(path.join(projectDist, 'index.html'), template);

        
        const styleFiles = await fs.readdir(stylesDir);
        const stylesArray = [];
        for (const file of styleFiles) {
            const filePath = path.join(stylesDir, file);
            if (path.extname(file) === '.css') {
                const styleContent = await fs.readFile(filePath, 'utf-8');
                stylesArray.push(styleContent);
            }
        }
        await fs.writeFile(path.join(projectDist, 'style.css'), stylesArray.join('\n'));

        const copyDir = async (src, dest) => {
            await fs.mkdir(dest, { recursive: true });
            const entries = await fs.readdir(src, { withFileTypes: true });
            for (const entry of entries) {
                const srcPath = path.join(src, entry.name);
                const destPath = path.join(dest, entry.name);
                if (entry.isDirectory()) {
                    await copyDir(srcPath, destPath);
                } else {
                    await fs.copyFile(srcPath, destPath);
                }
            }
        };

        await copyDir(assetsDir, path.join(projectDist, 'assets'));

    } catch (err) {
        console.error("Ошибка:", err);
    }
}

buildPage();
