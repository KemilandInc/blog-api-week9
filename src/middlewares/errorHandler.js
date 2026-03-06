
const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    console.error(err.message); // Log the error message for debugging
    console.error(err.stack || '');   
    const status = err.status || 500;

    if (err instanceof multer.MulterError)
        res.status(400).json("Invalid file size or file too large ")
    res.status(status).json({ error: err.message });
};

module.exports = errorHandler;