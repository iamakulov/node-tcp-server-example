const createDebug = require('debug');
const handleEcho = require('./commands/handleEcho');
const handleTime = require('./commands/handleTime');

const debug = createDebug('lab1:processCommand');

const processCommand = (command, commandParams, socket) => {
    const handlerByCommandWord = {
        echo: handleEcho,
        time: handleTime,
        close: () => {
            debug('Closing the connection...');
            socket.end();
        },
    };
    const defaultHandler = () => {
        debug(`Command ${command} is not supported`);
        return `Command ${command} is not supported`;
    };

    const handler = handlerByCommandWord[command] || defaultHandler;
    const response = handler(commandParams);
    if (response) {
        socket.write(`${response}\n`, 'utf-8');
    }
};

module.exports = processCommand;
