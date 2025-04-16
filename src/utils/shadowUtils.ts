import { Platform } from 'react-native';

/**
 * Creates a shadow style object that works on both web and native platforms
 * 
 * @param color Shadow color
 * @param offsetX Shadow offset X
 * @param offsetY Shadow offset Y
 * @param opacity Shadow opacity
 * @param radius Shadow radius
 * @param elevation Android elevation
 * @returns Platform-specific shadow style object
 */
export const createShadow = (
  color: string,
  offsetX: number,
  offsetY: number,
  opacity: number,
  radius: number,
  elevation: number
) => {
  if (Platform.OS === 'web') {
    // For web, use boxShadow
    return {
      boxShadow: `${offsetX}px ${offsetY}px ${radius}px rgba(0, 0, 0, ${opacity})`,
    };
  } else {
    // For native platforms, use the standard shadow properties
    return {
      shadowColor: color,
      shadowOffset: { width: offsetX, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
      elevation: elevation,
    };
  }
};

// Predefined shadow styles
export const shadows = {
  none: createShadow('transparent', 0, 0, 0, 0, 0),
  sm: createShadow('#000', 0, 1, 0.2, 1.41, 2),
  md: createShadow('#000', 0, 2, 0.23, 2.62, 4),
  lg: createShadow('#000', 0, 4, 0.3, 4.65, 8),
  xl: createShadow('#000', 0, 8, 0.44, 10.32, 16),
  '2xl': createShadow('#000', 0, 12, 0.58, 16.0, 24),
};