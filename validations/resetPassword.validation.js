const Joi = require("joi");

exports.passwordValidation = (body) => {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9!$@#]{6,30}$"))
      .required(),
    confirm_password: Joi.valid(Joi.ref("password")).required().messages({
      "any.only": "Parollar mos emas",
    }),
  });

  return schema.validate(body, { abortEarly: false });
};
