const joi = require("joi");

const urlSchema = joi.string().uri().required();

module.exports = urlSchema;
