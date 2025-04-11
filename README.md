<h1 align="center">GoogleTakeoutParser - Export your photos seamlessly.</h1>

<p align="center">A robust program powered by NodeJS to format and update metadata for your Google Takeout export, keeping your files up-to-date.<br><br></p>

## Features
- Effortlessly scan your Google Photos for any metadata discrepancies.
- Update and format your photos and videos with the latest metadata.
- Easily separate your Apple Live Photos from your Google Takeout export.

## Installation/Usage
To use GoogleTakeoutParser for your own export, you'll need to make sure that Node.js is properly installed on your computer (run `node --version` to check if it exists). If you don't have it installed yet, you can download it [here](https://nodejs.org/en/download).

Next, you'll need to download and extract the latest version of this repository:

```bash
$ git clone https://github.com/BrianWalczak/GoogleTakeoutParser.git; # Clone the repository from GitHub
$ cd GoogleTakeoutParser # Enter the extracted repository folder
$ npm install # Install libraries and dependencies
```

If you'd like to do this without using the Terminal, you can check the latest releases [here](https://github.com/BrianWalczak/GoogleTakeoutParser/releases/) and unzip the folder.

Next, make sure your Google Takeout export is properly unzipped, and drag all of your albums into **one** folder only. This is necessary to make sure that all of your Takeout files are properly merged.

Once you've done this, you can start the program with the GUI interface by running the following command:
```bash
$ node gui.js
```

### Without GUI
If you'd like to run this project without the help of the GUI interface, you can run the `index.js` file. Before you do this, you'll have to export your settings first as an environment variable:
```bash
$ export INPUT=/path/to/takeout
$ export OUTPUT=/path/to/takeout_output
```

## Contributons
If you'd like to contribute to this project, please create a pull request [here](https://github.com/BrianWalczak/GoogleTakeoutParser/pulls). You can submit your feedback or any bugs that you find, on our <a href='https://github.com/BrianWalczak/GoogleTakeoutParser/issues'>issues page</a>. Contributions are highly appreciated and will help us keep this project up-to-date!

If you'd like to support this project and its development, you can send me a donation <a href='https://ko-fi.com/brianwalczak'>here</a> :)

<br>
  <p align="center">Made with ♡ by <a href="https://www.brianwalczak.com">Briann</a></p>
