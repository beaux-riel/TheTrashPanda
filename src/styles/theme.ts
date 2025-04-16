import { theme } from './designSystem';

// Export the theme for use in styled-components
export default theme;

// Create a type for the theme to be used with styled-components
export type Theme = typeof theme;

// Create a type for the colors to be used with styled-components
export type Colors = typeof theme.colors;

// Helper function to get a color from the theme
export const getColor = (color: keyof Colors) => theme.colors[color];

// Helper function to get a spacing value from the theme
export const getSpacing = (space: keyof typeof theme.spacing) => theme.spacing[space];

// Helper function to get a border radius value from the theme
export const getBorderRadius = (radius: keyof typeof theme.borders.radius) => theme.borders.radius[radius];