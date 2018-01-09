const createDebug = require('debug');

const debug = createDebug('lab1:handleEcho');

const handleTime = () => {
    debug('Called the handleTime command');
    return new Date().toISOString();
};

module.exports = handleTime;
