const { searchDirectories } = require('./utils/folders.js');
const path = require('path');

async function isYearFolder(dirPath) {
    const dirName = path.basename(dirPath);
    const isYearFolder = /^Photos from \d{4}$/.test(dirName);

    if (isYearFolder) return true;
    return false;
}

async function isAlbumFolder(dirPath) {
    const parentDirectory = await searchDirectories(path.dirname(dirPath), false);

    for (const dir of parentDirectory) {
        const isYear = await isYearFolder(dir);
        
        if (isYear) return true;
    }

    return false;
}

async function getDirectories(output) {
    const allFolders = [];
    const outputDirs = await searchDirectories(output, true);

    for (const directory of outputDirs) {
        if(await isYearFolder(directory)) {
            allFolders.push({ path: directory, type: 'year' });
        } else if(await isAlbumFolder(directory)) {
            allFolders.push({ path: directory, type: 'album' });
        } else {
            continue;
        }
    }

    return allFolders;
}

module.exports = { getDirectories };