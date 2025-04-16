import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';

import { theme } from '@/styles/designSystem';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  title,
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...rest
}) => {
  const buttonStyles = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    fullWidth && styles.fullWidth,
    disabled && styles[`${variant}ButtonDisabled`],
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles[`${variant}TextDisabled`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' ? theme.colors.primary.main : theme.colors.neutral.white}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={textStyles}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borders.radius.md,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: '600',
  },
  
  // Primary Button
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
  },
  primaryButtonDisabled: {
    backgroundColor: theme.colors.neutral.light,
  },
  primaryText: {
    color: theme.colors.neutral.white,
  },
  primaryTextDisabled: {
    color: theme.colors.neutral.medium,
  },
  
  // Secondary Button
  secondaryButton: {
    backgroundColor: theme.colors.secondary.main,
  },
  secondaryButtonDisabled: {
    backgroundColor: theme.colors.neutral.light,
  },
  secondaryText: {
    color: theme.colors.neutral.white,
  },
  secondaryTextDisabled: {
    color: theme.colors.neutral.medium,
  },
  
  // Outline Button
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: theme.borders.width.medium,
    borderColor: theme.colors.primary.main,
  },
  outlineButtonDisabled: {
    borderColor: theme.colors.neutral.light,
  },
  outlineText: {
    color: theme.colors.primary.main,
  },
  outlineTextDisabled: {
    color: theme.colors.neutral.medium,
  },
  
  // Text Button
  textButton: {
    backgroundColor: 'transparent',
  },
  textButtonDisabled: {
    backgroundColor: 'transparent',
  },
  textText: {
    color: theme.colors.primary.main,
  },
  textTextDisabled: {
    color: theme.colors.neutral.medium,
  },
  
  // Accent Button
  accentButton: {
    backgroundColor: theme.colors.accent.main,
  },
  accentButtonDisabled: {
    backgroundColor: theme.colors.neutral.light,
  },
  accentText: {
    color: theme.colors.neutral.darkest,
  },
  accentTextDisabled: {
    color: theme.colors.neutral.medium,
  },
  
  // Button Sizes
  smButton: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
  },
  mdButton: {
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
  },
  lgButton: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[8],
  },
  
  // Text Sizes
  smText: {
    fontSize: theme.typography.fontSize.sm,
  },
  mdText: {
    fontSize: theme.typography.fontSize.md,
  },
  lgText: {
    fontSize: theme.typography.fontSize.lg,
  },
});

export default Button;