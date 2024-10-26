const fs = require('fs');
const path = require('path');

async function moveFile(sourcePath, destPath) {
    try {
        const destDir = path.dirname(destPath);
        await fs.promises.mkdir(destDir, { recursive: true });
        
        await fs.promises.rename(sourcePath, destPath);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = { moveFile };