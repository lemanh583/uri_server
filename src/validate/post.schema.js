const Joi = require('joi');

const schema = Joi.object({
    title: Joi.string(),
    content: Joi.string(),
    descriptions: Joi.string(),
    category: [Joi.string(),  Joi.array().items(Joi.string())]
})

module.exports = schema