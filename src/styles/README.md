# HarvestLink Design System

This directory contains the HarvestLink design system, a comprehensive set of design tokens, components, and guidelines for creating a consistent and accessible user experience.

## Files in this Directory

- `designSystem.ts` - The main design system file containing all design tokens
- `DesignSystemShowcase.tsx` - A visual showcase of the design system elements
- `DESIGN_SYSTEM_GUIDE.md` - Detailed documentation on using the design system
- `index.ts` - Exports all design system components for easy import

## Getting Started

To use the design system in your components, import the necessary tokens:

```tsx
import { colors, typography, spacing, borders, shadows } from '../styles';
// or
import { theme } from '../styles';
```

## Design System Structure

The design system is organized into the following sections:

1. **Colors** - A comprehensive color palette including primary, secondary, accent, and feedback colors
2. **Typography** - Font families, sizes, weights, and predefined text styles
3. **Spacing** - A consistent spacing scale based on a 4px unit
4. **Borders & Radius** - Border widths, styles, and radius values
5. **Shadows & Elevation** - Shadow definitions for both web and native platforms
6. **Responsive Breakpoints** - Standard breakpoints for responsive design
7. **Component Design Tokens** - Predefined styles for common components
8. **Icon Guidelines** - Standards for icon usage

## Viewing the Design System

You can view the design system showcase by navigating to the Design System screen in the app. This provides a visual reference for all design tokens and components.

## Accessibility

The design system is designed to meet WCAG AA accessibility standards. All color combinations have been tested for sufficient contrast, and components are designed to be accessible to all users.

## Implementation Examples

For implementation examples, refer to the `DESIGN_SYSTEM_GUIDE.md` file, which provides detailed examples of how to use the design system with React Native StyleSheet and styled-components.

## Customizing the Design System

While the design system provides a comprehensive set of tokens, you may need to extend or modify it for specific use cases. When doing so, please maintain consistency with the existing system and ensure that any modifications meet accessibility standards.

## Contributing

If you identify issues or have suggestions for improving the design system, please create an issue or submit a pull request with your proposed changes.