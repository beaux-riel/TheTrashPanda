# HarvestLink Design System Guide

This guide provides an overview of the HarvestLink design system and how to implement it in your components. The design system is built to be accessible (WCAG AA compliant), responsive, and appropriate for both producer and consumer user types.

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Responsive Design](#responsive-design)
7. [Accessibility Guidelines](#accessibility-guidelines)
8. [Implementation Examples](#implementation-examples)

## Design Principles

The HarvestLink design system is built on the following principles:

- **Natural & Fresh**: Using colors and elements that evoke agriculture, growth, and freshness
- **Trustworthy & Transparent**: Creating a sense of reliability and openness
- **Accessible & Inclusive**: Ensuring the app is usable by everyone
- **Intuitive & Efficient**: Making interactions simple and straightforward
- **Responsive & Adaptive**: Working seamlessly across all devices

## Color Palette

Our color palette is inspired by nature and agriculture, with greens representing growth and freshness, earthy browns for grounding, and amber accents for warmth and energy.

### Primary Colors (Green)
- **Main**: `#4CAF50` - Use for primary buttons, active states, and brand elements
- **Light**: `#A5D6A7` - Use for secondary elements, backgrounds, and hover states
- **Dark**: `#2E7D32` - Use for text on light backgrounds and hover states

### Secondary Colors (Earthy Brown)
- **Main**: `#8D6E63` - Use for secondary buttons and complementary elements
- **Light**: `#D7CCC8` - Use for backgrounds and subtle elements
- **Dark**: `#5D4037` - Use for text on light backgrounds

### Accent Colors (Amber)
- **Main**: `#FFC107` - Use for calls to action, highlights, and important elements
- **Light**: `#FFE082` - Use for backgrounds and subtle accents
- **Dark**: `#FFA000` - Use for hover states and text

### Neutral Colors
- **White**: `#FFFFFF` - Primary background
- **Lightest**: `#F5F5F5` - Secondary background
- **Light**: `#E0E0E0` - Borders and dividers
- **Medium**: `#9E9E9E` - Disabled states
- **Dark**: `#616161` - Secondary text
- **Darkest**: `#212121` - Primary text

### Feedback Colors
- **Success**: `#4CAF50` - Positive actions and confirmations
- **Warning**: `#FFC107` - Alerts and cautions
- **Error**: `#F44336` - Errors and destructive actions
- **Info**: `#2196F3` - Informational messages

## Typography

### Font Families
- **Primary**: Inter (UI elements, body text)
- **Secondary**: Montserrat (Headings, emphasis)
- **Monospace**: Roboto Mono (Code, data)

### Font Sizes
- **xs**: 12px - Captions, fine print
- **sm**: 14px - Secondary text, labels
- **md**: 16px - Body text (base size)
- **lg**: 18px - Important content
- **xl**: 20px - Small headings
- **2xl**: 24px - Medium headings
- **3xl**: 30px - Large headings
- **4xl**: 36px - Page titles
- **5xl**: 48px - Hero text

### Text Styles
We provide predefined text styles for common use cases:
- Headings (h1-h5)
- Body text (bodyLarge, body, bodySmall)
- Special text (caption, button, label)

## Spacing & Layout

Our spacing system is based on a 4px unit, creating a consistent rhythm throughout the interface.

```
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
...and so on
```

Use these spacing values for margins, padding, and positioning to maintain consistency.

## Components

### Buttons

We have several button variants for different emphasis levels:

1. **Primary Button**: High emphasis, main actions
   - Green background
   - White text
   - Medium border radius

2. **Secondary Button**: Medium emphasis
   - Brown background
   - White text
   - Medium border radius

3. **Outline Button**: Lower emphasis
   - Transparent background
   - Green border and text
   - Medium border radius

4. **Text Button**: Lowest emphasis
   - No background or border
   - Green text
   - No border radius

5. **Accent Button**: Call to action
   - Amber background
   - Dark text
   - Medium border radius

Each button has states for hover, active, and disabled.

### Cards

Cards are used to group related content and actions:

1. **Standard Card**: Default card with medium shadow
2. **Elevated Card**: More prominent card with larger shadow
3. **Outlined Card**: Card with border instead of shadow
4. **Flat Card**: Card with no shadow, just a subtle background

### Form Elements

Form elements are designed for clarity and ease of use:

1. **Input Fields**: Clean, bordered inputs with clear focus states
2. **Checkboxes & Radio Buttons**: Accessible selection controls
3. **Dropdowns**: Consistent with other form elements
4. **Labels**: Clear, positioned above inputs

### Navigation

Navigation components maintain consistency across the app:

1. **Top Bar**: Main navigation with app branding
2. **Bottom Tabs**: Mobile navigation for main sections
3. **Drawer**: Side navigation for additional options

## Responsive Design

Our breakpoints follow standard device sizes:

- **xs**: 0px (Mobile phones)
- **sm**: 576px (Large phones, portrait tablets)
- **md**: 768px (Landscape tablets)
- **lg**: 992px (Desktops)
- **xl**: 1200px (Large desktops)
- **2xl**: 1400px (Extra large desktops)

Design components to adapt appropriately across these breakpoints.

## Accessibility Guidelines

All components should meet WCAG AA standards:

- **Color Contrast**: Maintain 4.5:1 contrast ratio for normal text and 3:1 for large text
- **Focus States**: Provide clear focus indicators for keyboard navigation
- **Text Size**: Ensure text is readable and can be resized
- **Touch Targets**: Make interactive elements at least 44x44px
- **Screen Readers**: Include appropriate ARIA labels and roles

## Implementation Examples

### Using with React Native StyleSheet

```jsx
import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../styles/designSystem';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    padding: spacing[4],
    borderRadius: borders.radius.md,
  },
  heading: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.neutral.darkest,
    marginBottom: spacing[2],
  },
  paragraph: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.normal,
    color: colors.neutral.dark,
  },
});
```

### Using with Styled Components

```jsx
import styled from 'styled-components/native';
import { colors, spacing, typography } from '../styles/designSystem';

const Card = styled.View`
  background-color: ${colors.neutral.white};
  padding: ${spacing[6]}px;
  border-radius: ${borders.radius.lg}px;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  elevation: 4;
`;

const Heading = styled.Text`
  font-family: ${typography.fontFamily.secondary};
  font-size: ${typography.fontSize.xl}px;
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.darkest};
  margin-bottom: ${spacing[2]}px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => props.variant === 'primary' 
    ? colors.primary.main 
    : props.variant === 'secondary' 
      ? colors.secondary.main 
      : 'transparent'};
  padding: ${spacing[3]}px ${spacing[6]}px;
  border-radius: ${borders.radius.md}px;
  align-items: center;
  justify-content: center;
  ${props => props.variant === 'outline' && `
    border-width: ${borders.width.medium}px;
    border-color: ${colors.primary.main};
  `}
`;

const ButtonText = styled.Text`
  color: ${props => 
    props.variant === 'primary' || props.variant === 'secondary'
      ? colors.neutral.white
      : colors.primary.main};
  font-family: ${typography.fontFamily.primary};
  font-size: ${typography.fontSize.md}px;
  font-weight: ${typography.fontWeight.medium};
`;
```

### Producer vs Consumer UI Differentiation

For producer interfaces, consider:
- Using more of the secondary (earthy) colors
- More data-dense layouts
- Emphasizing inventory and order management

For consumer interfaces, consider:
- Using more of the primary (green) and accent (amber) colors
- More visual, discovery-focused layouts
- Emphasizing product browsing and purchasing

## Conclusion

This design system provides a foundation for creating a consistent, accessible, and visually appealing experience for HarvestLink users. By following these guidelines, we can ensure that the application feels cohesive and professional while meeting the needs of both producers and consumers.