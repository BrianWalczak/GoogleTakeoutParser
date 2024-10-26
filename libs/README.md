# Node.js Library
This library contains several modules for managing and processing files and directories, used by GoogleTakeoutParser (directory search, metadata extraction, file health checks, file naming standardization, etc).

These functions were created by Brian Walczak and are licensed under the same terms as GoogleTakeoutParser. Please refer to the `LICENSE` for more details.


## Modules/Functions

### `get_directories.js`
Scans directories to identify if a folder is an album or yearly format.

#### Functions
`isYearFolder(dirPath)`: Checks if a directory is a year-based folder.

`isAlbumFolder(dirPath)`: Checks if a directory is part of an album by searching its parent folder.

`getDirectories(output)`: Retrieves all folders within a specified directory, classifying them by their type (year or album).


### `get_metadata.js`
Handles file metadata extraction and handles files by their names.

#### Functions
`dissectFile(file)`: Adjusts file names to match Google Photos format before searching for metadata.

`getMetadata(directoryPath, file)`: Reads and parses metadata for a file from their Google Photos JSON.

`scanForMetadata(directoryPath)`: Scans a directory to locate metadata for each file


### `status.js`
Scans through directories to locate metadata for each file and categorize them.

#### Functions
`checkFileHealth(dirs)`: Asynchronously scans multiple directories, utilizing `get_metadata.js` to categorize files as success or fail.


## Utilities

### `utils/dissect.files.js`
Adjusts the file names to a readable Google Photos format (for metadata lookup).

#### Functions
`bracketSwap(filename)`: Moves file numbering suffixes (e.g., "(1)", "(2)") to the end of the file extension.

`shortenName(file)`: Truncates file names if they exceed 51 characters.

`removeExtra(filename)`: Removes extra suffixes (e.g., "-edited", "-effects") from filenames (as done by Google Photos).


### `utils/file_type.js`
Checks the file extension of a file to check its format.

#### Functions
`getFileType(file)`: Checks the file format by its extension (video or photo).

`isVideo(file)`: Returns with a boolean of whether or not the file is a video.

`isPhoto(file)`: Returns with a boolean of whether or not the file is a photo.


### `utils/files.js`
Provides simple functions to handle files with `fs`.

#### Functions
`moveFile(sourcePath, destPath)`: Moves any file from a source path to a destination path (with folder creation).


### `utils/folders.js`
Uses recursive searching to gather directory paths for photos and videos.

#### Functions
`searchDirectories(dirPath, recursive)`: Searches a directory for all subdirectories for file handling.