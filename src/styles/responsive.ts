import { Dimensions, Platform, ScaledSize } from 'react-native';
import { breakpoints } from './designSystem';

/**
 * Responsive Utilities for HarvestLink
 * 
 * This file provides utilities for responsive design in React Native.
 */

// Get the window dimensions
const window = Dimensions.get('window');

/**
 * Determine if the current screen width is at least the specified breakpoint
 * @param breakpoint - The breakpoint to check against (xs, sm, md, lg, xl, 2xl)
 * @returns boolean - True if the screen width is at least the specified breakpoint
 */
export const isBreakpoint = (breakpoint: keyof typeof breakpoints): boolean => {
  return window.width >= breakpoints[breakpoint];
};

/**
 * Get the current active breakpoint
 * @returns The current active breakpoint (xs, sm, md, lg, xl, 2xl)
 */
export const getActiveBreakpoint = (): keyof typeof breakpoints => {
  if (window.width >= breakpoints['2xl']) return '2xl';
  if (window.width >= breakpoints.xl) return 'xl';
  if (window.width >= breakpoints.lg) return 'lg';
  if (window.width >= breakpoints.md) return 'md';
  if (window.width >= breakpoints.sm) return 'sm';
  return 'xs';
};

/**
 * Responsive value based on breakpoint
 * @param values - Object with breakpoint keys and corresponding values
 * @returns The value for the current active breakpoint
 * 
 * Example:
 * const fontSize = responsiveValue({
 *   xs: 14,
 *   md: 16,
 *   xl: 18,
 * });
 */
export const responsiveValue = <T>(values: Partial<Record<keyof typeof breakpoints, T>>): T => {
  const activeBreakpoint = getActiveBreakpoint();
  
  // Find the closest breakpoint that has a defined value
  const breakpointOrder: (keyof typeof breakpoints)[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const activeIndex = breakpointOrder.indexOf(activeBreakpoint);
  
  // Look for the closest defined breakpoint, starting from the active one and going down
  for (let i = activeIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp] as T;
    }
  }
  
  // If no matching breakpoint is found, return the smallest defined breakpoint
  for (const bp of breakpointOrder) {
    if (values[bp] !== undefined) {
      return values[bp] as T;
    }
  }
  
  throw new Error('No responsive values provided');
};

/**
 * Hook to listen for dimension changes
 * @param callback - Function to call when dimensions change
 * @returns Function to remove the event listener
 */
export const useDimensionsChange = (
  callback: (dimensions: { window: ScaledSize; screen: ScaledSize }) => void
): (() => void) => {
  const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
    callback({ window, screen });
  });
  
  return () => subscription.remove();
};

/**
 * Check if the device is a tablet
 * @returns boolean - True if the device is a tablet
 */
export const isTablet = (): boolean => {
  const { width, height } = window;
  const aspectRatio = height / width;
  
  // Consider devices with aspect ratio less than 1.6 as tablets
  // Also consider larger devices as tablets
  return Platform.OS === 'ios' 
    ? (aspectRatio < 1.6 && Math.max(width, height) >= 900)
    : (aspectRatio < 1.6 && Math.max(width, height) >= 720);
};

export default {
  isBreakpoint,
  getActiveBreakpoint,
  responsiveValue,
  useDimensionsChange,
  isTablet,
};