const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.clear();
console.log(chalk.bold('--- Google Takeout Parser [v1.1] ---'));
console.log(chalk.underline('Developed and maintained by Brian Walczak'));
console.log(chalk.underline('This program will update the metadata of your Google Photos Takeout folder.\n'));

rl.question('Please enter the folder location of your Takeout: ', async (inputPath) => {

    try {
        await fs.promises.access(inputPath);
    } catch {
        console.log(chalk.red("It looks like this folder doesn't exist or is improperly formatted. Please try again."));
        process.exit(1);
    }

    console.log('Your Takeout folder has been successfully located.');
    rl.question('\nPlease enter an output location for your Takeout: ', async (outputPath) => {
        try {
            await fs.promises.access(outputPath);
            console.log('Your updated files will be saved in this folder.');
        } catch {
            console.log(chalk.yellow("This output folder doesn't exist, your output folder will be created."));
            await fs.promises.mkdir(outputPath);
        }

        process.env.INPUT = inputPath;
        process.env.OUTPUT = outputPath;

        console.log(chalk.green('\n\nYour configuration has been saved successfully, starting file scan...'));
        await sleep(2000);
        console.clear();
        require('child_process').fork('index.js');
        rl.close();
    });
});
