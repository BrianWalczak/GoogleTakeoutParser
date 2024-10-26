// If there are duplicate files, brackets are shifted to the end of the file extension
function bracketSwap(filename) {
    const regex = /\(\d+\)\./g;
    const match = filename.match(regex);

    if (!match || match.length === 0) {
        return filename;
    }

    const lastMatch = match[match.length - 1];
    const bracket = lastMatch.replace('.', '');
    const escapedBracket = bracket.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Remove the last match from the filename and append it at the end
    const withoutBracket = filename.replace(new RegExp(escapedBracket), '');
    return `${withoutBracket}${bracket}`;
}

// Google Takeout has been known to truncate files based on name
function shortenName(file) {
    if(`${file}.json`.length > 51) {
        return file.substring(0, 51 - '.json'.length);
    } else {
        return file;
    }
}

// Remove any extra file changes in name
const extras = [ '-edited', '-effects', '-smile', '-mix', '-edytowane', '-bearbeitet', '-bewerkt', '-編集済み', '-modificato', '-modifié', '-ha editado' ];
function removeExtra(filename) {
    filename = filename.normalize('NFC');
    
    for (const extra of extras) {
        const regex = new RegExp(`${extra}(?!.*${extra})`, 'i');
        if (regex.test(filename)) {
            return filename.replace(regex, '');
        }
    }
    
    return filename;
}

module.exports = { bracketSwap, shortenName, removeExtra };