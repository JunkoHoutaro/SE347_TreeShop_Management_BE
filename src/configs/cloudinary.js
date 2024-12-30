require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const configCloudinary = () => {
    if (!process.env.CLOUDINARY_URL) {
        console.warn('!! cloudinary config is undefined !!');
        console.warn('export CLOUDINARY_URL or set dotenv file');
    } else {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvb2x1trn',
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET, 
            secure: true
        });

        console.log('Cloudinary configuration successful');
    }
};


module.exports = configCloudinary;