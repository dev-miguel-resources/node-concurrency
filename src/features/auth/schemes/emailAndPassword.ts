import Joi, { ObjectSchema } from 'joi';

const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is a required field',
    'string.email': 'Email must be a valid format'
  })
});

const passwordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is a required field',
    'string.min': 'Password must be a least four characters',
    'string.max': 'Password must be at most eight characters'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.base': 'Confirm password must be a string',
    'any.required': 'Confirm password is a required field',
    'any.only': 'Password should match'
  })
});

export { emailSchema, passwordSchema };
