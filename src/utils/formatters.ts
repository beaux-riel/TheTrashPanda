import { format, formatDistance, parseISO } from 'date-fns';

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string, formatString: string = 'MMM d, yyyy'): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    return 'Invalid date';
  }
};

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

// Format distance in miles
export const formatDistance = (distanceInMiles: number): string => {
  if (distanceInMiles < 0.1) {
    return 'Less than 0.1 miles';
  } else if (distanceInMiles < 10) {
    return `${distanceInMiles.toFixed(1)} miles`;
  } else {
    return `${Math.round(distanceInMiles)} miles`;
  }
};

// Format phone number
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the input is valid
  if (cleaned.length !== 10) {
    return phoneNumber;
  }
  
  // Format as (XXX) XXX-XXXX
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

// Format address
export const formatAddress = (
  address: string,
  city: string,
  state: string,
  zipCode: string
): string => {
  return `${address}, ${city}, ${state} ${zipCode}`;
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength) + '...';
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format percentage
export const formatPercentage = (value: number, decimalPlaces: number = 0): string => {
  return `${(value * 100).toFixed(decimalPlaces)}%`;
};

// Format quantity with unit
export const formatQuantity = (quantity: number, unit: string): string => {
  return `${quantity} ${unit}${quantity !== 1 && !unit.endsWith('s') ? 's' : ''}`;
};