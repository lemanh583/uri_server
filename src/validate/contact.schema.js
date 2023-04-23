const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.number().integer(),
    description: Joi.string().empty(),
    base: Joi.string().empty()
})

module.exports = schema