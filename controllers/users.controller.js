const Joi = require('joi');
const bcrypt = require('bcrypt');

const model = require('../models/users.model');
const validator = require('../validators/user.validator');

async function gets(req, res) {
    const result = await model.gets();

    res.status(200).json({
        status: 'success',
        message: 'Success get users',
        data: result
    })
}

async function get(req, res, next) {
    try {
        
        const result = await model.get(req.user);

        res.status(200).json({
            status: 'success',
            message: 'Success get user',
            data: result
        });

    } catch (error) {
        next(error);
    }
}

async function post(req, res, next) {
    try {
        await validator.validateAsync(req.body);

        req.body.password = await bcrypt.hash(req.body.password, 10);

        const result = await model.post(req.body);

        res.status(200).json({
            status: 'success',
            message: 'Success post data',
            data: result
        });

    } catch (error) {
        next(error);
    }
}

async function put(req, res, next) {
    try {

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const result = await model.put(req.user, req.body);

        res.status(200).json({
            status: 'success',
            message: 'Success put data',
            data: result
        });

    } catch (error) {
        next(error);
    }
}

async function _delete(req, res, next) {
    try {
        await model.delete(req.user);
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