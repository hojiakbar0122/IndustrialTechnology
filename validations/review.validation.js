const Joi = require("joi");

exports.reviewValidation = (body) => {
    const schema = Joi.object({
      techId: Joi.number().integer(),
      clientId: Joi.number().integer(),
      rating: Joi.number().integer().min(1).max(5),
      comment: Joi.string().allow(null, ""),
      created_at: Joi.date()
    });
  
    return schema.validate(body, { abortEarly: false });
  };
  