const multer = require('multer');
const cloudinary = require('../config/cloudinary.js');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uploads'
    }
});

const upload = multer ({
    storage,
});


module.exports = upload;