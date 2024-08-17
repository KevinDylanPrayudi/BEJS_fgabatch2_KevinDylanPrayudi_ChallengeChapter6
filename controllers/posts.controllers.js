const model = require('../models/posts.model');
const Joi = require('joi');

const validator = require('../validators/posts.validator');
const imagekit = require('../lib/imagekit');

async function gets(req, res, next) {

    try {
        const result = await model.gets();

        res.status(200).json({
            status: 'success',
            message: 'Success get posts',
            data: result
        })

    } catch (error) {
        next(error);
    }

}

async function get(req, res, next) {
    try {
        Joi.attempt(req.params.id, Joi.number().integer().required(), message = 'Invalid id');

        const result = await model.get({
            id: req.params.id,
            userId: req.user
        });

        res.status(200).json({
            status: 'success',
            message: 'Success get post',
            data: result
        })
    } catch (error) {
        next(error);
    }
}

async function post(req, res, next) {

    try {
        await validator.validateAsync({
            title: req.body.title,
            content: req.body.content,
            image: req.file
        });

        const image = await imagekit.upload({
            useUniqueFileName: false,
            file: Buffer.from(req.file.buffer).toString('base64'),
            fileName: Date.now() + Math.round(Math.random() * 1E9) + '-' + req.file.originalname,
        });

        const result = await model.post({
            title: req.body.title,
            content: req.body.content,
            imageid: image.fileId,
            imageurl: image.url,
            userId: req.user
        });

        res.status(200).json({
            status: 'success',
            message: 'Success post data',
            data: {
                id: result.id,
                title: result.title,
                url: image.url,
                name: req.file.originalname,
                content: result.content
            }
        });

    } catch (error) {
        next(error)
    }
}

async function put(req, res, next) {
    let imageurl;

    try {
        Joi.attempt(req.params.id, Joi.number().integer().required(), message = 'Invalid id');

        let result = await model.get({
            id: req.params.id,
            userId: req.user
        });

        if (!result) {
            return res.status(404).json({
                status: 'fail',
                message: 'Data not found'
            });
        }

        if (req.file) {

            imagekit.deleteFile(result.imageid, (error, result) => {
                if (error) {
                    console.log(error);
                }
            });

            imagekit.purgeCache(result.imageurl, (error, result) => {
                if (error) {
                    console.log(error);
                }
            })

            const image = await imagekit.upload({
                useUniqueFileName: false,
                file: Buffer.from(req.file.buffer).toString('base64'),
                fileName: Date.now() + Math.round(Math.random() * 1E9) + '-' + req.file.originalname,
            });

            result = await model.put({
                id: req.params.id,
                userId: req.user
            }, {
                title: req.body.title,
                content: req.body.content,
                imageid: image.fileId,
                imageurl: image.url
            });

            imageurl = image.url;
        } else {
            result = await model.put({
                id: req.params.id,
                userId: req.user
            }, {
                title: req.body.title,
                content: req.body.content
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Success put data',
            data: {
                id: result.id,
                title: result.title,
                content: result.content,
                imageurl
            }
        });


    } catch (error) {
        next(error)
    }
}

async function _delete(req, res, next) {
    try {
        Joi.attempt(req.params.id, Joi.number().integer().required(), message = 'Invalid id');

        let result = await model.get({
            id: req.params.id,
            userId: req.user
        });

        if (result) {

            imagekit.deleteFile(result.imageid, (error, result) => {
                if (error) {
                    console.log(error);
                }
            });

            imagekit.purgeCache(result.imageurl, (error, result) => {
                if (error) {
                    console.log(error);
                }
            });

            await model.delete({
                id: req.params.id,
                userId: req.user
            });
        }

        res.status(200).end();
    } catch (error) {
        next(error)
    }
}

module.exports = {
    gets,
    get,
    post,
    put,
    delete: _delete
}