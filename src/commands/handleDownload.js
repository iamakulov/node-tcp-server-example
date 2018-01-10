const fs = require('fs');
const path = require('path');
const util = require('util');
const createDebug = require('debug');
const getPersistentTmpDir = require('../utils/getPersistentTmpDir');

const debug = createDebug('lab1:handleDownload');

const handleDownload = async fileName => {
    debug('Called the handleDownload command');

    try {
        debug('Retrieving the file from', getPersistentTmpDir(), fileName);

        const filePath = path.resolve(getPersistentTmpDir(), fileName);
        const readFile = util.promisify(fs.readFile);
        const fileBuffer = await readFile(filePath);

        return fileBuffer.toString('base64');
    } catch (e) {
        return `ERROR ${e.message}`;
    }
};

module.exports = handleDownload;
