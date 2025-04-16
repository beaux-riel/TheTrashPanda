import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/styles/designSystem';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword = false,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur(e);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const containerStyles = [
    styles.container,
    containerStyle,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    isFocused && styles.inputContainerFocused,
    error && styles.inputContainerError,
    rest.editable === false && styles.inputContainerDisabled,
  ];

  const inputStyles = [
    styles.input,
    leftIcon && styles.inputWithLeftIcon,
    (rightIcon || isPassword) && styles.inputWithRightIcon,
    rest.editable === false && styles.inputDisabled,
    inputStyle,
  ];

  return (
    <View style={containerStyles}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <View style={inputContainerStyles}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={inputStyles}
          placeholderTextColor={theme.colors.neutral.medium}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !showPassword}
          {...rest}
        />
        
        {isPassword ? (
          <TouchableOpacity style={styles.rightIcon} onPress={togglePasswordVisibility}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.colors.neutral.medium}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </View>
      
      {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[4],
  },
  label: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[2],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.white,
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.neutral.light,
    borderRadius: theme.borders.radius.md,
    height: theme.spacing[12],
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary.main,
  },
  inputContainerError: {
    borderColor: theme.colors.error.main,
  },
  inputContainerDisabled: {
    backgroundColor: theme.colors.neutral.lightest,
    borderColor: theme.colors.neutral.light,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: theme.spacing[4],
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
  },
  inputWithLeftIcon: {
    paddingLeft: theme.spacing[1],
  },
  inputWithRightIcon: {
    paddingRight: theme.spacing[1],
  },
  inputDisabled: {
    color: theme.colors.neutral.medium,
  },
  leftIcon: {
    paddingLeft: theme.spacing[3],
  },
  rightIcon: {
    paddingRight: theme.spacing[3],
  },
  error: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error.main,
    marginTop: theme.spacing[1],
  },
});

export default Input;