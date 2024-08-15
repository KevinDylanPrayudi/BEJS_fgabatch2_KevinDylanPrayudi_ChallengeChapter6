const multer = require('multer');
const Joi = require('joi');

const CustomError = require('../utils/error');

module.exports = (err, req, res, next) => {
    console.log(err)
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    } else if(err instanceof CustomError) {
        return res.status(err.status).json({
            status: 'fail',
            message: err.message
        });
    } else if(err?.isJoi) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }



    res.status(500).json({
        error: 'Internal Server Error'
    });
}