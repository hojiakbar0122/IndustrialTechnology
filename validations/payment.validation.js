const Joi = require("joi");

exports.paymentValidation = (body) => {
    const schema = Joi.object({
      contractId: Joi.number().integer(),
      amount: Joi.number().precision(2),
      paid_at: Joi.date(),
      method: Joi.string().valid("cash", "card", "transfer"),
      status: Joi.string().valid("paid", "completed", "cancelled"),
    });
  
    return schema.validate(body, { abortEarly: false });
  };
  