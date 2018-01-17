const { createSocket } = require('dgram');
const createDebug = require('debug');
const processCommand = require('./processCommand');
const sendSocketResponse = require('./utils/sendSocketResponse');

const debug = createDebug('lab1:index');

const socket = createSocket('udp4');

let totalRead = 0;
let totalWritten = 0;

const requests = {};

let verificationTimeout;
const verifyRequests = () => {
    debug('Executing the timeout');
    Object.keys(requests)
        .filter(
            requestId =>
                Object.keys(requests[requestId].chunks).length <
                requests[requestId].totalChunks,
        )
        .forEach(requestId => {
            debug(`Erroring the ${requestId} timeout`);

            const { totalChunks } = requests[requestId];
            const receivedChunks = Object.keys(requests[requestId].chunks)
                .length;
            const lostChunks = totalChunks - receivedChunks;
            sendSocketResponse(
                `ERROR Lost ${lostChunks} of ${totalChunks} chunks on the server`,
                socket,
                requests[requestId].clientPort,
                requests[requestId].clientAddress,
            );
            delete requests[requestId];
        });
};

socket.on('message', async (data, reqInfo) => {
    const decodedData = data.toString('utf-8');
    totalRead += decodedData.length;
    debug('Received the data:', decodedData);

    const normalizedRequest = decodedData.trim();
    const [
        ,
        requestId,
        chunkIndex,
        totalChunks,
        chunkContent,
    ] = normalizedRequest.match(/^(.+)::(.+)::(.+)::(.+)$/);

    requests[requestId] = requests[requestId] || {
        clientPort: reqInfo.port,
        clientAddress: reqInfo.address,
        totalChunks: Number(totalChunks),
        chunks: {},
    };
    requests[requestId].chunks[chunkIndex] = chunkContent;

    clearTimeout(verificationTimeout);

    if (
        Object.keys(requests[requestId].chunks).length ===
        requests[requestId].totalChunks
    ) {
        debug('Executing the command');
        const requestContent = Object.values(requests[requestId].chunks).join(
            '',
        );
        const command = requestContent.split(' ')[0].toLowerCase();
        const commandParams = requestContent
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
    } else {
        debug('Setting the timeout');
        verificationTimeout = setTimeout(verifyRequests, 10000);
    }
});

socket.on('listening', () => {
    socket.setSendBufferSize(50 * 1024 * 1024);
    socket.setRecvBufferSize(50 * 1024 * 1024);
    console.log('Server is running at port 3000');
});

socket.on('error', e => {
    debug('Connection errored', e);
});

socket.on('close', () => {
    debug('Connection closed');
});

socket.bind(3000);
