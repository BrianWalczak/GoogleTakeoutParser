const inputFile = process.env.INPUT;
const outputFile = process.env.OUTPUT;
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { getMetadata, scanForMetadata } = require('./libs/get_metadata.js');
const { getDirectories } = require('./libs/get_directories.js');
const { checkFileHealth } = require('./libs/status.js');
const { moveFile } = require('./libs/utils/files.js');
const { isVideo, isPhoto } = require('./libs/utils/file_type.js');
const livePhotos = new Set();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if(!inputFile || !outputFile) throw new Error("Please provide the path to the Takeout folder (export INPUT) and the output folder (export OUTPUT) in environment variables to continue.");

function livePhotoCheck(req, item) {
    for (const potentialFile of req.success) {
        const successBaseName = path.parse(potentialFile).name; // Extract the base name of the successful image file
        const failedBaseName = path.parse(item).name; // Extract the base name of the failed video file

        if (isPhoto(path.basename(potentialFile)) && isVideo(path.basename(item)) && successBaseName === failedBaseName) { // Check if there's a match between the successful image and failed video
            livePhotos.add(path.basename(item)); // Add failed item to livePhotos array if match is found
        }
    };

    return;
}

async function run() {
    const dirs = await getDirectories(inputFile);
    const { successCount, failedCount } = await checkFileHealth(dirs);
    
    if (successCount === 0) {
        console.log(chalk.red('[FAILED] ') + 'No valid files were found in the specified Takeout folder!');
        process.exit(1);
    }

    console.log(chalk.green('[SUCCESS]') + ' Successfully collected ' + successCount + ' items (' + failedCount + ' are missing metadata).');
    await new Promise(resolve => setTimeout(resolve, 3000));

    for (const dir of dirs) {
        const req = await scanForMetadata(dir.path);

        for (const failedItem of req.failed) {
            const item = path.join(dir.path, failedItem);

            console.log(chalk.red('[FAILED]') + " Couldn't locate metadata for item --> " + failedItem);
            await moveFile(item, path.join(outputFile, "missing_date", failedItem));

            livePhotoCheck(req, item); // Check for potential live photos
        }

        for (const successItem of req.success) {
            const meta = await getMetadata(dir.path, successItem);
            const creationDate = new Date(meta.photoTakenTime.timestamp * 1000);

            await fs.promises.utimes(path.join(dir.path, successItem), creationDate, creationDate);
            await moveFile(path.join(dir.path, successItem), path.join(outputFile, successItem));
            console.log(chalk.yellow('[UPDATED]') + ' Successfully updated metadata for item --> ' + successItem);
        }
    }

    console.log(chalk.green(`\n\nSuccessfully updated all ${successCount} files in output `) + chalk.red('(' + failedCount + ' failed items)') + '.');
    
    if (failedCount > 0) {
        console.log('Failed items can occur when the metadata file is missing or improperly formatted by Google Photos. However, the most common occurrence is with live photos taken by an iPhone.');
        console.log('When a live photo is taken on an Apple device, the live is extracted and saved as a separate video file. However, Google Photos only creates metadata for the image file.');

        rl.question(chalk.yellow('Would you like to run a scan for your failed items to check for live photos (y/n)? '), async (response) => {
            if (response.toLowerCase() === "y") {
                for (const item of Array.from(livePhotos)) {
                    await moveFile(path.join(outputFile, "missing_date", item), path.join(outputFile, "live_videos", item));
                }
                await fs.promises.writeFile('./live.json', JSON.stringify(Array.from(livePhotos), null, 2), 'utf8');

                console.log('\n\nAn estimate of ' + Array.from(livePhotos).length + ' failed items may be live. These videos have been moved to the "live_videos" folder in the output directory.');
                process.exit(1);
            } else {
                console.log('Please check the "missing_date" folder in the output directory for all failed items.');
                process.exit(1);
            }
        });
    }
}

console.clear();
run();