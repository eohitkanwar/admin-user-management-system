import Joi from 'joi';

// User registration validation schema
export const registerUserSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 30 characters',
      'any.required': 'Username is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

// User login validation schema
export const loginUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

// User validation middleware for general use
export const userValidation = (req, res, next) => {
  try {
    const validationSchema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().min(18).required(),
      email: Joi.string().lowercase().email().required(),
      password: Joi.string().min(4).required(),
    });
    
    const { error } = validationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json(error.details);
    }
    next();
  } catch (error) {
    console.log("Validation error:", error);
    res.status(500).json({ success: false, message: "Validation error" });
  }
};
