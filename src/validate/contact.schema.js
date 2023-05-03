const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.number().integer(),
    description: Joi.string(),
    base: Joi.string(),
    course: Joi.string(),
})

module.exports = schema