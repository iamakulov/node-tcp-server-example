const getTmpDir = require('os-tmpdir');

const tmpDir = getTmpDir();
const getPersistentTmpDir = () => tmpDir;

module.exports = getPersistentTmpDir;
