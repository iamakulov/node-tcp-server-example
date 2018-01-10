const { Buffer } = require('buffer');
const fs = require('fs');
const path = require('path');
const util = require('util');
const createDebug = require('debug');
const getPersistentTmpDir = require('../utils/getPersistentTmpDir');

const debug = createDebug('lab1:handleUpload');

const handleUpload = async commandParams => {
    debug('Called the handleUpload command');
    const [fileName, fileContent] = commandParams.split(' ');

    const filePath = path.resolve(getPersistentTmpDir(), fileName);
    const fileBuffer = Buffer.from(fileContent, 'base64');
    const writeFile = util.promisify(fs.writeFile);

    await writeFile(filePath, fileBuffer);
    debug('Saved the file as', filePath);

    return `OK ${fileName}`;
};

module.exports = handleUpload;
