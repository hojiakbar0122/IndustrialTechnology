exports.locationValidation = (body) => {
    const schema = Joi.object({
      address: Joi.string(),
      city: Joi.string(),
      region: Joi.string(),
      lat: Joi.number(),
      lng: Joi.number()
    });
  
    return schema.validate(body, { abortEarly: false });
  };
  