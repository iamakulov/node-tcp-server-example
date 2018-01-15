const splitToChunks = (str, length) =>
    str.match(new RegExp(`.{1,${length}}`, 'g'));

module.exports = splitToChunks;
