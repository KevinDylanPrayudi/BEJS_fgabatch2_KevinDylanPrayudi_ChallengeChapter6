const Joi = require('joi');

const definition = {
    username: Joi.string().required(),
    password: Joi.string().required()
}

const schema = Joi.compile(definition);

module.exports = schema;