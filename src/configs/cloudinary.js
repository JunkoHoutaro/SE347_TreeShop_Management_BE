const CLOUDINARY_URL='cloudinary://661496711387959:2CCrv5pCjg-Ll4C9XSEu8IiS2F0@ddziqv9ot'
require('dotenv').config(); 
const configCloudinary = () => {
    if (typeof process.env.CLOUDINARY_URL === 'undefined') {
        console.warn('!! cloudinary config is undefined !!');
        console.warn('export CLOUDINARY_URL or set dotenv file');
    } else {
        console.log('cloudinary config:');
        console.log(cloudinary.config());
    }
};

module.exports = configCloudinary;