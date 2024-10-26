const fs = require('fs');
const path = require('path');

const { bracketSwap, shortenName, removeExtra } = require('./utils/dissect.files.js');

function dissectFile(file, legacy = false) {
    let newFile = legacy ? file : file + '.supplemental-metadata';
    newFile = bracketSwap(newFile);
    newFile = shortenName(newFile);
    newFile = removeExtra(newFile);

    return newFile;
}

async function getMetadata(directoryPath, file) {
    try {
        let metadata = await fs.promises.readFile(path.join(directoryPath, `${dissectFile(file)}.json`), 'utf8');
        metadata = JSON.parse(metadata);

        return metadata;
    } catch(error) {
        if (error.code === 'ENOENT') {
            // check for legacy naming (w/o supplementary-metadata)
            try {
                let metadata = await fs.promises.readFile(path.join(directoryPath, `${dissectFile(file, true)}.json`), 'utf8');
                metadata = JSON.parse(metadata);
        
                return metadata;
            } catch(error) {
                return undefined;
            }
        }
    }
}

async function scanForMetadata(directoryPath) {
    const fileList = {
        success: [],
        failed: []
    };

    try {
        const files = await fs.promises.readdir(directoryPath);

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const fileStats = await fs.promises.stat(filePath);
            const fileExtension = path.extname(file);

            // Skip directories and files that are already .json
            if (fileStats.isDirectory() || fileExtension === '.json') {
                continue;
            }

            let jsonFilePath = path.join(directoryPath, `${dissectFile(file)}.json`); // not all functions may be used for each file

            // Check if .json file with the same name exists
            try {
                await fs.promises.access(jsonFilePath);
                fileList.success.push(file);
            } catch {
                // check for legacy naming (w/o supplementary-metadata)
                try {
                    jsonFilePath = path.join(directoryPath, `${dissectFile(file, true)}.json`);
                    await fs.promises.access(jsonFilePath);

                    fileList.success.push(file);
                } catch {
                    fileList.failed.push(file);
                }
            }
        }

        return fileList;
    } catch {
        return fileList;
    }
}

module.exports = { getMetadata, scanForMetadata };