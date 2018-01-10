const createDebug = require('debug');

const debug = createDebug('lab1:handleTime');

const handleTime = () => {
    debug('Called the handleTime command');
    return new Date().toISOString();
};

module.exports = handleTime;
