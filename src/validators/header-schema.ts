import { Joi, Segments } from 'celebrate';

const headerSchema = {
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string()
      .regex(/^Bearer\s[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/)
      .required(),
  }).unknown(),
};

export default headerSchema;
