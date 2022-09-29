import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  APP_URL: Joi.string().required(),
  STAGE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXP_IN: Joi.number().default(3600),
  MULTER_DEST: Joi.string().default('/public'),
});
