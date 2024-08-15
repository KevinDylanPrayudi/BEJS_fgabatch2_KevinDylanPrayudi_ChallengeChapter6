const Joi = require('joi');

const definition = {
    title: Joi.string().required(),
    content: Joi.string().required(),
    image: Joi.required()
}

const schema = Joi.compile(definition);

module.exports = schema;