const myPath = "/path/to/takeout"; // Replace with the path to your Takeout folder
const myOutput = "/path/to/output"; // Replace with the path to your output folder
const fs = require('fs');
const path = require('path');

const { getMetadata, scanForMetadata } = require('./libs/get_metadata.js');
const { getDirectories } = require('./libs/get_directories.js');
const { checkFileHealth } = require('./libs/status.js');
const { moveFile } = require('./libs/utils/files.js');


async function run(input, output) {
    const dirs = await getDirectories(input);
    const { successCount, failedCount } = await checkFileHealth(dirs);

    console.log('Successfully fetched ' + successCount + ' images (' + failedCount + ' are missing metadata)');
    await new Promise(resolve => setTimeout(resolve, 3000));

    const updatePromises = dirs.map(async dir => {
        const req = await scanForMetadata(dir.path);

        const successPromises = req.success.map(async successItem => {
            const meta = await getMetadata(dir.path, successItem);
            const creationDate = new Date(meta.photoTakenTime.timestamp * 1000);

            console.log('Updating metadata for item: ' + successItem + '...');
            await fs.promises.utimes(path.join(dir.path, successItem), creationDate, creationDate);
            await moveFile(path.join(dir.path, successItem), path.join(output, successItem));
        });

        const failedPromises = req.failed.map(async failedItem => {
            const item = path.join(dir.path, failedItem);

            console.log("Couldn't update metadata for: " + failedItem + '!');
            await moveFile(item, path.join(output, "missing_date", failedItem));
        });

        await Promise.all([...successPromises, ...failedPromises]);
    });

    await Promise.all(updatePromises);
    console.log('\n\nSuccessfully updated all ' + successCount + ' files in output (' + failedCount + ' failed items)');
}

console.clear();
run(myPath, myOutput);