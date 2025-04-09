exports.statusValidation = (body) => {
    const schema = Joi.object({
      name: Joi.string().min(2).max(30),
    });
  
    return schema.validate(body, { abortEarly: false });
  };
  