const Joi = require("joi");

exports.ownerValidation = (body) => {
  const schema = Joi.object({
    company_name: Joi.string().min(2).max(100),
    phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    email: Joi.string().email().lowercase(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!$@#]{6,30}$")),
    address: Joi.string(),
    registered_at: Joi.date(),
    is_active: Joi.boolean().default(false),
    activation_link: Joi.string().optional(),
  });

  return schema.validate(body, { abortEarly: false });
};
