import * as Yup from 'yup';

// Login form validation schema
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

// Registration form validation schema
export const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  userType: Yup.string()
    .oneOf(['consumer', 'producer'], 'Please select a valid user type')
    .required('User type is required'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions'),
});

// Forgot password form validation schema
export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

// Reset password form validation schema
export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Profile update form validation schema
export const profileUpdateSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(
      /^(\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      'Please enter a valid phone number'
    )
    .nullable(),
});

// Farm creation/update form validation schema
export const farmSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Farm name must be at least 2 characters')
    .max(100, 'Farm name must be less than 100 characters')
    .required('Farm name is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .required('Description is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code')
    .required('ZIP code is required'),
  latitude: Yup.number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .required('Latitude is required'),
  longitude: Yup.number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .required('Longitude is required'),
  tags: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one tag')
    .required('Tags are required'),
  farmingPractices: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one farming practice')
    .required('Farming practices are required'),
  farmSize: Yup.string().required('Farm size is required'),
  establishedYear: Yup.number()
    .min(1800, 'Year must be after 1800')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .required('Established year is required'),
});

// Product creation/update form validation schema
export const productSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters')
    .required('Product name is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .required('Description is required'),
  price: Yup.number()
    .min(0.01, 'Price must be greater than 0')
    .required('Price is required'),
  unit: Yup.string().required('Unit is required'),
  category: Yup.string().required('Category is required'),
  subcategory: Yup.string(),
  stock: Yup.number()
    .min(0, 'Stock cannot be negative')
    .required('Stock is required'),
  organic: Yup.boolean().required('Please specify if the product is organic'),
  seasonal: Yup.boolean().required('Please specify if the product is seasonal'),
  harvestDate: Yup.date().when('seasonal', {
    is: true,
    then: Yup.date().required('Harvest date is required for seasonal products'),
  }),
  tags: Yup.array().of(Yup.string()),
  images: Yup.array()
    .of(Yup.string())
    .min(1, 'Please upload at least one image')
    .required('Images are required'),
});