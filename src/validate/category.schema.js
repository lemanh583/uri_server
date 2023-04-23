const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string(),
})

module.exports = schema