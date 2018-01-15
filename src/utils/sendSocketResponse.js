const util = require('util');
const splitToChunks = require('./splitToChunks');

const sendSocketResponse = (response, socket, port, address) => {
    const chunks = splitToChunks(response, 50000);
    const promises = chunks.map((chunk, index) => {
        const asyncSend = util.promisify(socket.send.bind(socket));
        return asyncSend(`${index}::${chunks.length}::${chunk}`, port, address);
    });

    return Promise.all(promises);
};

module.exports = sendSocketResponse;
