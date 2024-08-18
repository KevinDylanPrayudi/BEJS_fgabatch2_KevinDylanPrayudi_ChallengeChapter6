const multer = require('multer');
const prisma = require('@prisma/client');

const CustomError = require('../utils/error');

module.exports = (err, req, res, next) => {
    console.log(err);
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
    } else if(err instanceof prisma.PrismaClientKnownRequestError) {
        if(err.code === 'P2002') {
            return res.status(400).json({
                status: 'fail',
                message: 'Username already exist. Please choose another one.'
            });
        }
    }

    res.status(500).json({
        error: 'Internal Server Error'
    });
}