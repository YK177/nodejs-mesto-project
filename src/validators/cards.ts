import { Joi, Segments } from 'celebrate';

export const createCardSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri().required(),
  }),
};

export const cardCommonActionsSchema = {
  [Segments.PARAMS]: Joi.object({
    cardId: Joi.string().required().alphanum().length(24),
  }),
};
