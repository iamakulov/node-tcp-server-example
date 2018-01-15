const createDebug = require('debug');
const handleEcho = require('./commands/handleEcho');
const handleTime = require('./commands/handleTime');
const handleDownload = require('./commands/handleDownload');
const handleUpload = require('./commands/handleUpload');

const debug = createDebug('lab1:processCommand');

const processCommand = async (
    command,
    commandParams,
    socket,
    port,
    address,
) => {
    const handlerByCommandWord = {
        echo: handleEcho,
        time: handleTime,
        download: handleDownload,
        upload: handleUpload,
        close: () => {
            debug('Closing the connection...');
            socket.end();
        },
    };
    const defaultHandler = () => {
        debug(`Command ${command} is not supported`);
        return `ERROR Command ${command} is not supported`;
    };

    const handler = handlerByCommandWord[command] || defaultHandler;
    const response = await handler(commandParams);
    if (response) {
        socket.send(response, port, address);
    }

    return response ? response.length : 0;
};

module.exports = processCommand;
