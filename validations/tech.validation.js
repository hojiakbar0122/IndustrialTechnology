const Joi = require("joi");

exports.techValidation = (body) => {
    const schema = Joi.object({
      ownerId: Joi.number().integer(),
      name: Joi.string(),
      description: Joi.string(),
      price_per_hour: Joi.number().precision(2),
      status: Joi.string().valid("active", "inactive", "repair", "available"),
      created_at: Joi.date(),
      categoryId: Joi.number().integer(),
      locationId: Joi.number().integer()
    });
  
    return schema.validate(body, { abortEarly: false });
  };
  