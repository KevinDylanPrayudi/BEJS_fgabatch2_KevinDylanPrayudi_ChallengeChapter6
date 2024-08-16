const ImageKit = require('imagekit');
const model = require('../models/posts.model');
const validator = require('../validators/posts.validator');
const Joi = require('joi');

async function gets(req, res, next) {

    try {
        const result = await model.gets();

        if (result.length > 0) {
            const imageKit = new ImageKit({
                publicKey: process.env.IMG_IO_PUBLIC_KEY,
                privateKey: process.env.IMG_IO_PRIVATE_KEY,
                urlEndpoint: process.env.IMG_IO_ENDPOINT
            });

            for (let i = 0; i < result.length; i++) {
                const filename = await imageKit.getFileDetails(result[i].image);
                const url = await imageKit.url({
                    src: process.env.IMG_IO_ENDPOINT + filename.name
                });
                result[i].image = url;
            }

        }

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
        const imageKit = new ImageKit({
            publicKey: process.env.IMG_IO_PUBLIC_KEY,
            privateKey: process.env.IMG_IO_PRIVATE_KEY,
            urlEndpoint: process.env.IMG_IO_ENDPOINT
        });

        const result = await model.get({
            id: req.params.id,
            userId: req.user
        });

        if (result?.image) {
            const filename = await imageKit.getFileDetails(result.image);

            result.image = await imageKit.url({
                src: process.env.IMG_IO_ENDPOINT + filename.name
            });
        }

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
    const imageKit = new ImageKit({
        publicKey: process.env.IMG_IO_PUBLIC_KEY,
        privateKey: process.env.IMG_IO_PRIVATE_KEY,
        urlEndpoint: process.env.IMG_IO_ENDPOINT
    });

    try {
        await validator.validateAsync({
            title: req.body.title,
            content: req.body.content,
            image: req.file
        });

        const image = await imageKit.upload({
            useUniqueFileName: false,
            file: Buffer.from(req.file.buffer).toString('base64'),
            fileName: Date.now() + Math.round(Math.random() * 1E9) + '-' + req.file.originalname,
        });

        const result = await model.post({
            title: req.body.title,
            content: req.body.content,
            image: image.fileId,
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
    let url;

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
            const imageKit = new ImageKit({
                publicKey: process.env.IMG_IO_PUBLIC_KEY,
                privateKey: process.env.IMG_IO_PRIVATE_KEY,
                urlEndpoint: process.env.IMG_IO_ENDPOINT
            });

            await imageKit.deleteFile(result.image);

            const image = await imageKit.upload({
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
                image: image.fileId
            });

            url = image.url;
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
                url
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
            const imageKit = new ImageKit({
                publicKey: process.env.IMG_IO_PUBLIC_KEY,
                privateKey: process.env.IMG_IO_PRIVATE_KEY,
                urlEndpoint: process.env.IMG_IO_ENDPOINT
            });

            await imageKit.deleteFile(result.image);
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