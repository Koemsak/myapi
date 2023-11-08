import Joi from 'joi';

export const onlinePaymentSchema = {
  username: Joi.string().required().messages({
    'string.empty': 'username is not allowed to be empty',
    'any.required': 'username is required',
    'string.base': 'username must be a string',
  }),
  rest_api_key: Joi.string().required().messages({
    'string.empty': 'rest api key is not allowed to be empty',
    'any.required': 'rest api key is required',
    'string.base': 'rest api key must be a string',
  }),
  payload: Joi.string().required().messages({
    'string.empty': 'payload is not allowed to be empty',
    'any.required': 'payload is required',
    'string.base': 'payload must be a string',
  }),
  hash: Joi.string().required().messages({
    'string.empty': 'hash is not allowed to be empty',
    'any.required': 'hash is required',
    'string.base': 'hash must be a string',
  }),
};

export const payloadSchema = {
  
};
