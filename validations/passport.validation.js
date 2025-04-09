const Joi = require("joi");

exports.passportValidation = (body) => {
  const schema = Joi.object({
    given_date: Joi.date(),
    born_date: Joi.date(),
    issued_by: Joi.string(),
    seria: Joi.string().length(9),
    clientId: Joi.number()
  });

  return schema.validate(body, { abortEarly: false });
};
