import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { DesignSystemShowcase } from '../../styles';
import { colors } from '../../styles/designSystem';

/**
 * Design System Screen
 * 
 * This screen displays the HarvestLink design system showcase.
 * It can be used by developers and designers to reference the design system.
 */
const DesignSystemScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.white} />
      <DesignSystemShowcase />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
});

export default DesignSystemScreen;