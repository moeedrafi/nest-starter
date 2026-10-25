import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // ────────────────────────────────────────────────
  // Server
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'local')
    .default('development'),
  PORT: Joi.number().default(8000),
  CORS_ORIGIN: Joi.string().allow(''),
  FRONTEND_URL: Joi.string().allow(''),

  // ────────────────────────────────────────────────
  // Auth
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRES_IN: Joi.required(),
  RESET_PASSWORD_TOKEN_SECRET: Joi.string().required(),
  RESET_PASSWORD_TOKEN_EXPIRES_IN: Joi.required(),

  // ────────────────────────────────────────────────
  // Database
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),
  DATABASE_SYNC: Joi.boolean().default(false),
  DATABASE_SSL: Joi.boolean().default(true),

  // ────────────────────────────────────────────────
  // Email
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_SECURE: Joi.boolean().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_FROM_NAME: Joi.string().required(),
  MAIL_FROM_ADDRESS: Joi.string().email().required(),
});
