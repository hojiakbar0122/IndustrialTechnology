const Joi = require("joi");

exports.contractValidation = (body) => {
  const schema = Joi.object({
    techId: Joi.number().integer(),
    clientId: Joi.number().integer(),
    ownerId: Joi.number().integer(),
    start_date: Joi.date(),
    end_date: Joi.date(),
    price: Joi.number().precision(2),
    statusId: Joi.number().integer(),
    is_damaged: Joi.boolean().optional(),
    damage_note: Joi.string().allow(null, ""),
    created_at: Joi.date()
  });

  return schema.validate(body, { abortEarly: false });
};
