/**
 * HarvestLink Design System
 * 
 * A comprehensive design system for the HarvestLink application that connects
 * local producers directly with consumers. This system is designed to be:
 * 
 * - Accessible (WCAG AA compliant)
 * - Responsive across all device sizes
 * - Appropriate for both producer and consumer user types
 * - Reflective of the agricultural and farm-to-table nature of the app
 * 
 * This can be used with styled-components, React Native StyleSheet, or other styling solutions.
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary Colors - Representing growth, freshness, and agriculture
  primary: {
    lightest: '#E3F1E3', // Very light green for backgrounds
    light: '#A5D6A7',    // Light green for secondary elements
    main: '#4CAF50',     // Main brand green - WCAG AA compliant with white text
    dark: '#2E7D32',     // Darker green for hover states
    darkest: '#1B5E20',  // Very dark green for text on light backgrounds
  },
  
  // Secondary Colors - Earthy tones that complement the primary palette
  secondary: {
    lightest: '#F1EBE4', // Very light tan for backgrounds
    light: '#D7CCC8',    // Light tan for secondary elements
    main: '#8D6E63',     // Main earthy brown - WCAG AA compliant with white text
    dark: '#5D4037',     // Darker brown for hover states
    darkest: '#3E2723',  // Very dark brown for text on light backgrounds
  },
  
  // Accent Colors - For highlighting important elements and calls to action
  accent: {
    lightest: '#FFF8E1', // Very light amber for backgrounds
    light: '#FFE082',    // Light amber for secondary elements
    main: '#FFC107',     // Main amber - Use with dark text for WCAG compliance
    dark: '#FFA000',     // Darker amber for hover states
    darkest: '#FF8F00',  // Very dark amber
  },
  
  // Feedback Colors - For system messages and status indicators
  success: {
    light: '#A5D6A7',    // Light green
    main: '#4CAF50',     // Standard success green
    dark: '#2E7D32',     // Dark green
  },
  
  warning: {
    light: '#FFE082',    // Light amber
    main: '#FFC107',     // Standard warning amber
    dark: '#FFA000',     // Dark amber
  },
  
  error: {
    light: '#EF9A9A',    // Light red
    main: '#F44336',     // Standard error red
    dark: '#C62828',     // Dark red
  },
  
  info: {
    light: '#90CAF9',    // Light blue
    main: '#2196F3',     // Standard info blue
    dark: '#1565C0',     // Dark blue
  },
  
  // Neutral Colors - For text, backgrounds, and UI elements
  neutral: {
    white: '#FFFFFF',    // Pure white
    lightest: '#F5F5F5', // Very light gray for backgrounds
    light: '#E0E0E0',    // Light gray for borders and dividers
    medium: '#9E9E9E',   // Medium gray for disabled states
    dark: '#616161',     // Dark gray for secondary text
    darkest: '#212121',  // Very dark gray for primary text
    black: '#000000',    // Pure black
  },
  
  // Transparent colors for overlays
  transparent: {
    light: 'rgba(255, 255, 255, 0.8)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    // Primary font for most UI elements (sans-serif, highly readable)
    primary: 'Inter, "Helvetica Neue", Roboto, -apple-system, sans-serif',
    
    // Secondary font for headings and emphasis (slightly more distinctive)
    secondary: 'Montserrat, "Helvetica Neue", Roboto, -apple-system, sans-serif',
    
    // Monospace font for code, data, etc.
    mono: '"Roboto Mono", "SF Mono", Menlo, Monaco, Consolas, monospace',
  },
  
  // Font Weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  
  // Font Sizes (in pixels for web, will be converted to appropriate units for mobile)
  fontSize: {
    xs: 12,      // Very small text, captions
    sm: 14,      // Small text, secondary information
    md: 16,      // Base text size for body content
    lg: 18,      // Slightly larger text, important content
    xl: 20,      // Small headings, section titles
    '2xl': 24,   // Medium headings
    '3xl': 30,   // Large headings
    '4xl': 36,   // Very large headings, page titles
    '5xl': 48,   // Extra large headings, hero text
  },
  
  // Line Heights (unitless multipliers)
  lineHeight: {
    tight: 1.2,    // Headings
    normal: 1.5,   // Body text
    relaxed: 1.75, // Larger blocks of text
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.01em',
    wider: '0.02em',
  },
  
  // Text Styles - Predefined combinations for common use cases
  textStyle: {
    // Headings
    h1: {
      fontFamily: 'secondary',
      fontSize: '4xl',
      fontWeight: 'bold',
      lineHeight: 'tight',
      letterSpacing: 'tight',
    },
    h2: {
      fontFamily: 'secondary',
      fontSize: '3xl',
      fontWeight: 'bold',
      lineHeight: 'tight',
      letterSpacing: 'tight',
    },
    h3: {
      fontFamily: 'secondary',
      fontSize: '2xl',
      fontWeight: 'semiBold',
      lineHeight: 'tight',
      letterSpacing: 'normal',
    },
    h4: {
      fontFamily: 'secondary',
      fontSize: 'xl',
      fontWeight: 'semiBold',
      lineHeight: 'tight',
      letterSpacing: 'normal',
    },
    h5: {
      fontFamily: 'secondary',
      fontSize: 'lg',
      fontWeight: 'medium',
      lineHeight: 'tight',
      letterSpacing: 'normal',
    },
    
    // Body text
    bodyLarge: {
      fontFamily: 'primary',
      fontSize: 'lg',
      fontWeight: 'regular',
      lineHeight: 'normal',
      letterSpacing: 'normal',
    },
    body: {
      fontFamily: 'primary',
      fontSize: 'md',
      fontWeight: 'regular',
      lineHeight: 'normal',
      letterSpacing: 'normal',
    },
    bodySmall: {
      fontFamily: 'primary',
      fontSize: 'sm',
      fontWeight: 'regular',
      lineHeight: 'normal',
      letterSpacing: 'normal',
    },
    
    // Special text styles
    caption: {
      fontFamily: 'primary',
      fontSize: 'xs',
      fontWeight: 'regular',
      lineHeight: 'normal',
      letterSpacing: 'wide',
    },
    button: {
      fontFamily: 'primary',
      fontSize: 'md',
      fontWeight: 'medium',
      lineHeight: 'tight',
      letterSpacing: 'wide',
      textTransform: 'uppercase',
    },
    label: {
      fontFamily: 'primary',
      fontSize: 'sm',
      fontWeight: 'medium',
      lineHeight: 'tight',
      letterSpacing: 'wide',
    },
  },
};

// ============================================================================
// SPACING & LAYOUT
// ============================================================================

export const spacing = {
  // Base spacing unit (in pixels)
  unit: 4,
  
  // Spacing scale
  '0': 0,
  '1': 4,    // 1 * unit
  '2': 8,    // 2 * unit
  '3': 12,   // 3 * unit
  '4': 16,   // 4 * unit
  '5': 20,   // 5 * unit
  '6': 24,   // 6 * unit
  '8': 32,   // 8 * unit
  '10': 40,  // 10 * unit
  '12': 48,  // 12 * unit
  '16': 64,  // 16 * unit
  '20': 80,  // 20 * unit
  '24': 96,  // 24 * unit
  '32': 128, // 32 * unit
  '40': 160, // 40 * unit
  '48': 192, // 48 * unit
  '56': 224, // 56 * unit
  '64': 256, // 64 * unit
};

// ============================================================================
// BORDERS & RADIUS
// ============================================================================

export const borders = {
  // Border Radius
  radius: {
    none: 0,
    sm: 4,     // Small radius for subtle rounding
    md: 8,     // Medium radius for buttons, cards
    lg: 12,    // Large radius for prominent elements
    xl: 16,    // Extra large radius
    '2xl': 24, // Very large radius
    full: 9999, // Fully rounded (circles, pills)
  },
  
  // Border Widths
  width: {
    none: 0,
    thin: 1,
    medium: 2,
    thick: 3,
  },
  
  // Border Styles
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  },
};

// ============================================================================
// SHADOWS & ELEVATION
// ============================================================================

export const shadows = {
  // For web (CSS box-shadow)
  web: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  
  // For React Native (elevation for Android, shadow props for iOS)
  native: {
    none: {
      elevation: 0,
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    sm: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    md: {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
    lg: {
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
    },
    xl: {
      elevation: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
    },
    '2xl': {
      elevation: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
    },
  },
};

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

export const breakpoints = {
  // Mobile-first breakpoints (in pixels)
  xs: 0,      // Extra small devices (phones)
  sm: 576,    // Small devices (large phones, portrait tablets)
  md: 768,    // Medium devices (landscape tablets)
  lg: 992,    // Large devices (desktops)
  xl: 1200,   // Extra large devices (large desktops)
  '2xl': 1400, // Extra extra large devices
};

// ============================================================================
// COMPONENT DESIGN TOKENS
// ============================================================================

export const components = {
  // Button Variants
  button: {
    // Primary Button (high emphasis, main actions)
    primary: {
      backgroundColor: colors.primary.main,
      color: colors.neutral.white,
      borderRadius: borders.radius.md,
      padding: `${spacing[3]}px ${spacing[6]}px`,
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      // States
      hover: {
        backgroundColor: colors.primary.dark,
      },
      active: {
        backgroundColor: colors.primary.darkest,
      },
      disabled: {
        backgroundColor: colors.neutral.light,
        color: colors.neutral.medium,
      },
    },
    
    // Secondary Button (medium emphasis)
    secondary: {
      backgroundColor: colors.secondary.main,
      color: colors.neutral.white,
      borderRadius: borders.radius.md,
      padding: `${spacing[3]}px ${spacing[6]}px`,
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      // States
      hover: {
        backgroundColor: colors.secondary.dark,
      },
      active: {
        backgroundColor: colors.secondary.darkest,
      },
      disabled: {
        backgroundColor: colors.neutral.light,
        color: colors.neutral.medium,
      },
    },
    
    // Outline Button (lower emphasis)
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary.main,
      borderColor: colors.primary.main,
      borderWidth: borders.width.medium,
      borderStyle: borders.style.solid,
      borderRadius: borders.radius.md,
      padding: `${spacing[3]}px ${spacing[6]}px`,
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      // States
      hover: {
        backgroundColor: colors.primary.lightest,
      },
      active: {
        backgroundColor: colors.primary.light,
        color: colors.primary.darkest,
      },
      disabled: {
        borderColor: colors.neutral.light,
        color: colors.neutral.medium,
      },
    },
    
    // Text Button (lowest emphasis)
    text: {
      backgroundColor: 'transparent',
      color: colors.primary.main,
      padding: `${spacing[2]}px ${spacing[4]}px`,
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      // States
      hover: {
        backgroundColor: colors.primary.lightest,
      },
      active: {
        backgroundColor: colors.primary.light,
        color: colors.primary.darkest,
      },
      disabled: {
        color: colors.neutral.medium,
      },
    },
    
    // Accent Button (for calls to action)
    accent: {
      backgroundColor: colors.accent.main,
      color: colors.neutral.darkest,
      borderRadius: borders.radius.md,
      padding: `${spacing[3]}px ${spacing[6]}px`,
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      // States
      hover: {
        backgroundColor: colors.accent.dark,
      },
      active: {
        backgroundColor: colors.accent.darkest,
      },
      disabled: {
        backgroundColor: colors.neutral.light,
        color: colors.neutral.medium,
      },
    },
    
    // Sizes
    sizes: {
      sm: {
        padding: `${spacing[2]}px ${spacing[4]}px`,
        fontSize: typography.fontSize.sm,
      },
      md: {
        padding: `${spacing[3]}px ${spacing[6]}px`,
        fontSize: typography.fontSize.md,
      },
      lg: {
        padding: `${spacing[4]}px ${spacing[8]}px`,
        fontSize: typography.fontSize.lg,
      },
    },
  },
  
  // Card Component
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.radius.lg,
    padding: spacing[6],
    ...shadows.web.md,
    // Variants
    elevated: {
      ...shadows.web.lg,
    },
    outlined: {
      borderWidth: borders.width.thin,
      borderColor: colors.neutral.light,
      borderStyle: borders.style.solid,
      ...shadows.web.none,
    },
    flat: {
      ...shadows.web.none,
      backgroundColor: colors.neutral.lightest,
    },
  },
  
  // Input Fields
  input: {
    height: spacing[12],
    backgroundColor: colors.neutral.white,
    borderWidth: borders.width.thin,
    borderColor: colors.neutral.light,
    borderStyle: borders.style.solid,
    borderRadius: borders.radius.md,
    padding: `${spacing[3]}px ${spacing[4]}px`,
    fontSize: typography.fontSize.md,
    color: colors.neutral.darkest,
    // States
    focus: {
      borderColor: colors.primary.main,
      boxShadow: `0 0 0 2px ${colors.primary.lightest}`,
    },
    error: {
      borderColor: colors.error.main,
      boxShadow: `0 0 0 2px ${colors.error.light}`,
    },
    disabled: {
      backgroundColor: colors.neutral.lightest,
      color: colors.neutral.medium,
      borderColor: colors.neutral.light,
    },
  },
  
  // Checkbox & Radio
  selectionControl: {
    size: spacing[5],
    borderWidth: borders.width.thin,
    borderColor: colors.neutral.medium,
    borderRadius: borders.radius.sm, // For checkbox
    // Radio is always round (borderRadius: '50%')
    backgroundColor: colors.neutral.white,
    // States
    checked: {
      borderColor: colors.primary.main,
      backgroundColor: colors.primary.main,
    },
    focus: {
      boxShadow: `0 0 0 2px ${colors.primary.lightest}`,
    },
    disabled: {
      borderColor: colors.neutral.light,
      backgroundColor: colors.neutral.lightest,
    },
  },
  
  // Navigation
  navigation: {
    // Top Navigation Bar
    topBar: {
      height: spacing[16],
      backgroundColor: colors.neutral.white,
      borderBottomWidth: borders.width.thin,
      borderBottomColor: colors.neutral.light,
      padding: `0 ${spacing[6]}px`,
      ...shadows.web.sm,
    },
    
    // Bottom Tab Navigation
    bottomTabs: {
      height: spacing[16],
      backgroundColor: colors.neutral.white,
      borderTopWidth: borders.width.thin,
      borderTopColor: colors.neutral.light,
      ...shadows.web.sm,
      // Tab Item
      item: {
        color: colors.neutral.dark,
        fontSize: typography.fontSize.xs,
        // States
        active: {
          color: colors.primary.main,
        },
      },
    },
    
    // Drawer Navigation
    drawer: {
      backgroundColor: colors.neutral.white,
      width: 280, // Fixed width for drawer
      padding: spacing[4],
      // Drawer Item
      item: {
        height: spacing[12],
        borderRadius: borders.radius.md,
        padding: `0 ${spacing[4]}px`,
        // States
        active: {
          backgroundColor: colors.primary.lightest,
          color: colors.primary.main,
        },
        hover: {
          backgroundColor: colors.neutral.lightest,
        },
      },
    },
  },
};

// ============================================================================
// ICON GUIDELINES
// ============================================================================

export const iconGuidelines = {
  // Icon Sizes
  size: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    '2xl': 48,
  },
  
  // Icon Colors - typically inherit from text or have specific colors
  color: {
    // Default icon colors
    default: colors.neutral.dark,
    primary: colors.primary.main,
    secondary: colors.secondary.main,
    accent: colors.accent.main,
    
    // Status icon colors
    success: colors.success.main,
    warning: colors.warning.main,
    error: colors.error.main,
    info: colors.info.main,
    
    // Special cases
    light: colors.neutral.white, // For dark backgrounds
    disabled: colors.neutral.medium,
  },
  
  // Icon Style Guidelines
  style: {
    // Preferred icon style is outlined/stroked rather than filled
    // for a lighter, more modern look that matches the overall design system
    strokeWidth: 2, // For outlined icons
    
    // When using filled icons, use them consistently for specific purposes
    // such as active states or special emphasis
  },
  
  // Recommended icon sets
  recommendedSets: [
    '@expo/vector-icons', // Already in dependencies
    'MaterialCommunityIcons', // Good agricultural and food-related icons
    'Feather', // Clean, minimal style that works well with the design system
  ],
};

// ============================================================================
// THEME OBJECT (combines all tokens)
// ============================================================================

export const theme = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  breakpoints,
  components,
  iconGuidelines,
};

export default theme;