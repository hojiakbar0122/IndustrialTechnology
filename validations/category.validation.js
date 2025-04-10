const Joi = require("joi");

exports.categoryValidation = (body) => {
    const schema = Joi.object({
      name: Joi.string().min(2).max(50),
      description: Joi.string().allow(null, ""),
    });
  
    return schema.validate(body, { abortEarly: false });
  };
  