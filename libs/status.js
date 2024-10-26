const { scanForMetadata } = require('./get_metadata.js');

async function checkFileHealth(dirs) {
    let successCount = 0;
    let failedCount = 0;

    const promises = dirs.map(async (dir) => {
        try {
            const req = await scanForMetadata(dir.path);
            successCount += req.success.length;
            failedCount += req.failed.length;
        } catch {}
    });

    await Promise.all(promises);
    return { successCount, failedCount };
}

module.exports = { checkFileHealth };
