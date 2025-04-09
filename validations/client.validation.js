const Joi = require("joi");

exports.clientValidation = (body) => {
  const schema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    email: Joi.string().email().lowercase(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!$@#]{6,30}$")),
    confirm_password: Joi.ref("password"),
    address: Joi.string().max(255),
    role: Joi.string(),
    is_active: Joi.boolean().default(false),
    activation_link: Joi.string().optional(),
    registered_at: Joi.date(),
  });

  return schema.validate(body, { abortEarly: false });
};
