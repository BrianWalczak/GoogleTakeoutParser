const fs = require('fs');
const path = require('path');

const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.3gp', '.3g2', '.m4v', '.mpg', '.mpeg', '.m2v', '.f4v', '.f4p', '.f4a', '.f4b',  '.m2ts', '.ts', '.mts', '.vob', '.ogv', '.gifv', '.swf'];
const photoExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp', '.heic', '.heif', '.raw', '.cr2', '.nef', '.orf', '.sr2', '.arw', '.dng', '.rw2', '.raf', '.pef', '.3fr', '.erf', '.kdc', '.mos', '.mef', '.nrw', '.srw', '.x3f'];

function getFileType(file) {
    if (isVideo(file)) {
        return 'video';
    } else if (isPhoto(file)) {
        return 'photo';
    } else {
        return 'other';
    }
}

function isVideo(file) {
    return videoExtensions.includes(path.extname(file).toLowerCase());
};

function isPhoto(file) {
    return photoExtensions.includes(path.extname(file).toLowerCase());
};

module.exports = { getFileType, isVideo, isPhoto };