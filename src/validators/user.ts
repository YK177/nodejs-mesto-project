import { Joi, Segments } from 'celebrate';

export const getUserSchema = {
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().required().alphanum().length(24),
  }),
};

export const updateProfileSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
};

export const updateAvatarSchema = {
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().uri().required(),
  }),
};
