const Joi = require("joi");

exports.attachmentValidation = (body) => {
    const schema = Joi.object({
      techId: Joi.number(),//.integer(),
      file_url: Joi.string().uri(),
      type: Joi.string().valid("image", "manual", "certificate"),
      uploaded_at: Joi.date(),
    });
  
    return schema.validate(body, { abortEarly: false });
  };
  