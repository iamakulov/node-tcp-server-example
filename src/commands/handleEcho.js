const createDebug = require('debug');

const debug = createDebug('lab1:handleEcho');

const handleEcho = commandParams => {
    debug('Called the handleEcho command');
    return commandParams;
};

module.exports = handleEcho;
