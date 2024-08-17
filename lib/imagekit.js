const ImageKit = require('imagekit');
require('dotenv').config();

module.exports = new ImageKit({
    publicKey: process.env.IMG_IO_PUBLIC_KEY,
    privateKey: process.env.IMG_IO_PRIVATE_KEY,
    urlEndpoint: process.env.IMG_IO_ENDPOINT
});