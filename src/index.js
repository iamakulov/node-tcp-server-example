const { createSocket } = require('dgram');
const createDebug = require('debug');
const processCommand = require('./processCommand');

const debug = createDebug('lab1:index');

const socket = createSocket('udp4');

let totalRead = 0;
let totalWritten = 0;

socket.on('message', async (data, reqInfo) => {
    const decodedData = data.toString('utf-8');
    totalRead += decodedData.length;
    debug('Received the data:', decodedData);

    const normalizedRequest = decodedData.trim();
    const command = normalizedRequest.split(' ')[0].toLowerCase();
    const commandParams = normalizedRequest
        .split(' ')
        .slice(1)
        .join(' ');

    totalWritten += await processCommand(
        command,
        commandParams,
        socket,
        reqInfo.port,
        reqInfo.address,
    );

    console.log(`Read: ${totalRead} b · Written: ${totalWritten} b`);
});

socket.on('listening', () => {
    console.log('Server is running at port 3000');
});

socket.on('error', e => {
    debug('Connection errored', e);
});

socket.on('close', () => {
    debug('Connection closed');
});

socket.bind(3000);
