const { check } = require('express-validator');

exports.validateSignup = [
  check('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name must be ≤50 characters'),
  
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be ≥8 characters'),
  
  check('admissionNumber')
    .if(check('role').equals('student'))
    .notEmpty().withMessage('Admission number is required for students'),
  
  check('class')
    .if(check('role').equals('student'))
    .notEmpty().withMessage('Class is required for students'),
  
  check('guardianPhone')
    .if(check('role').equals('student'))
    .notEmpty().withMessage('Guardian phone is required for students')
    .isMobilePhone().withMessage('Invalid phone number')
];

exports.validateLogin = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  
  check('password')
    .notEmpty().withMessage('Password is required')
];

exports.validateForgotPassword = [
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
];

exports.validateResetPassword = [
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be ≥8 characters')
];