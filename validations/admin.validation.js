const Joi = require("joi");

exports.adminValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20),
    email: Joi.string().email().lowercase(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!$@#]{6,30}$")),
    confirm_password: Joi.ref("password"),
    phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    role: Joi.string().valid("admin", "superadmin"),
    is_active: Joi.boolean().default(false),
    activation_link: Joi.string().optional(),
  });

  return schema.validate(body, { abortEarly: false });
};
