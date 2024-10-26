const fs = require('fs');
const path = require('path');

async function searchDirectories(dirPath, recursive = false) {
  let directories = [];

  async function traverseDirectory(currentPath) {
    const items = await fs.promises.readdir(currentPath, { withFileTypes: true });

    const subdirs = items.filter(item => item.isDirectory());

    for (const subdir of subdirs) {
      const subdirPath = path.join(currentPath, subdir.name);
      directories.push(subdirPath);
      if (recursive) {
        await traverseDirectory(subdirPath);
      }
    }
  }

  if (recursive) {
    await traverseDirectory(dirPath);
  } else {
    const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
    directories = items.filter(item => item.isDirectory()).map(item => path.join(dirPath, item.name));
  }

  return directories;
}

module.exports = { searchDirectories };