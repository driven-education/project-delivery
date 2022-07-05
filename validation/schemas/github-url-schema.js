const joi = require("joi");

const githubUrlSchema = joi
  .string()
  .pattern(/(http|https):\/\/(www.)?github\.com\/(\w|\d|-)+\/(\w|\d|-)+\/?/)
  .uri()
  .required();

module.exports = githubUrlSchema;
