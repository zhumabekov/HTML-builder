const fs = require('fs/promises');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const indexFile = path.join(projectDist, 'index.html');
const templateFile = path.join(__dirname, 'template.html');
const stylesFile = path.join(projectDist, 'style.css');
const stylesFolderPath = path.join(__dirname, 'styles');
const authAssets = path.join(__dirname, 'assets');
const cloneAssets = path.join(projectDist, 'assets');
const componentsDir = path.join(__dirname, 'components');

async function createDir() {
  try {
    await fs.mkdir(projectDist, { recursive: true });
    await fs.writeFile(indexFile, '');
    await fs.writeFile(stylesFile, '');
  } catch (err) {
    console.error(err);
  }
}

async function cloneDir() {
  try {
    const files = await fs.readdir(
      authAssets,
      { withFileTypes: true },
      (files) => files,
    );

    for (const file of files) {
      if (file.isFile()) {
        await fs.copyFile(
          path.join(authAssets, file),
          path.join(cloneAssets, file),
        );
      } else {
        const innerFiles = await fs.readdir(
          path.join(file.path, file.name),
          (files) => files,
        );
        await fs.mkdir(path.join(cloneAssets, file.name), { recursive: true });
        const cloneInnerDir = path.join(cloneAssets, file.name);
        const authInnerDir = path.join(authAssets, file.name);

        for (const file of innerFiles) {
          await fs.copyFile(
            path.join(authInnerDir, file),
            path.join(cloneInnerDir, file),
          );
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function switchTags() {
  try {
    const templateFileText = await fs.readFile(templateFile, 'utf8');
    const templateMatches = templateFileText.match(/{{(.*?)}}/g);
    const templateParts = templateFileText.split(/{{(.*?)}}/);
    let newText = '';

    for (const part of templateParts) {
      if (templateMatches.includes(`{{${part}}}`)) {
        const textPart = await fs.readFile(
          path.join(componentsDir, `${part}.html`),
        );
        newText += textPart;
      } else {
        const textPart = part;
        newText += textPart;
      }
    }

    fs.writeFile(indexFile, newText);
  } catch (err) {
    console.error(err);
  }
}

async function mergeStyles() {
  try {
    const files = await fs.readdir(stylesFolderPath, (files) => files);
    let newInner = '';

    for (const file of files) {
      const filePath = path.join(__dirname, file);
      const fileExt = path.extname(filePath);

      if (fileExt === '.css') {
        const fileInner = await fs.readFile(
          path.join(__dirname, 'styles', file),
          'utf8',
        );
        newInner += fileInner;
      }
    }
    fs.writeFile(stylesFile, newInner);
  } catch (err) {
    console.error(err);
  }
}

async function createPage() {
  try {
    await createDir();
    await cloneDir();
    switchTags();
    mergeStyles();
  } catch (err) {
    console.error(err);
  }
}

createPage();
