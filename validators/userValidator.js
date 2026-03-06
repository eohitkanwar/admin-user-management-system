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

// User update validation schema
export const updateUserSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .optional()
    .messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 30 characters'
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  role: Joi.string()
    .valid('user', 'admin')
    .optional()
    .messages({
      'any.only': 'Role must be either "user" or "admin"'
    }),
  status: Joi.string()
    .valid('active', 'inactive', 'suspended')
    .optional()
    .messages({
      'any.only': 'Status must be either "active", "inactive", or "suspended"'
    }),
  bio: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Bio must not exceed 500 characters'
    })
});

// Change password validation schema
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Current password is required',
      'any.required': 'Current password is required'
    }),
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 6 characters long',
      'any.required': 'New password is required'
    })
});

// Forgot password validation schema
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    })
});

// Reset password validation schema
export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

// MongoDB ObjectId validation schema


// Pagination validation schema
