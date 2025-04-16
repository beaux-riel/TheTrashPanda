import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { theme } from '@/styles/designSystem';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'default', style }) => {
  const cardStyles = [styles.card, styles[variant], style];

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing[6],
    ...theme.shadows.native.md,
  },
  default: {},
  elevated: {
    ...theme.shadows.native.lg,
  },
  outlined: {
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.neutral.light,
    ...theme.shadows.native.none,
  },
  flat: {
    backgroundColor: theme.colors.neutral.lightest,
    ...theme.shadows.native.none,
  },
});

export default Card;