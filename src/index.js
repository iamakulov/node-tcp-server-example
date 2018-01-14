const { createServer } = require('net');
const createDebug = require('debug');
const processCommand = require('./processCommand');

const debug = createDebug('lab1:index');

createServer(socket => {
    debug(`Client ${socket.remoteAddress}:${socket.remotePort} connected`);

    let buffer = '';

    socket.on('data', async data => {
        const decodedData = data.toString('utf-8');
        buffer += decodedData;
        debug('Received the data:', decodedData);

        const requests = buffer.split(/\r?\n/);
        const completeRequests = requests.slice(0, -1);
        buffer = requests[requests.length - 1];

        if (completeRequests.length > 0) {
            const promises = completeRequests.map(request => {
                debug('Handling a request:', request);

                const normalizedRequest = request.trim();

                const command = normalizedRequest.split(' ')[0].toLowerCase();
                const commandParams = normalizedRequest
                    .split(' ')
                    .slice(1)
                    .join(' ');

                return processCommand(command, commandParams, socket);
            });

            await Promise.all(promises);
        }

        console.log(
            `Read: ${socket.bytesRead} b · Written: ${socket.bytesWritten} b`,
        );
    });

    socket.on('error', () => {
        debug('Connection aborted');
    });

    socket.on('close', () => {
        debug('Connection closed');
    });
}).listen(3000);

console.log('Server is running at port 3000');
