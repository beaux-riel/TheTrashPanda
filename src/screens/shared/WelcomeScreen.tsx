import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { AuthStackScreenProps } from '@/navigation/types';
import { theme } from '@/styles/designSystem';

export default function WelcomeScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'Welcome'>['navigation']>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>🌱</Text>
        <Text style={styles.appName}>HarvestLink</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.tagline}>Connecting farms directly to your table</Text>
        <Text style={styles.description}>
          Discover fresh, local produce from farms near you. Support local agriculture and enjoy
          farm-to-table freshness.
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.primaryButtonText}>Log In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.white,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: theme.spacing[16],
  },
  logoText: {
    fontSize: 64,
    marginBottom: theme.spacing[4],
  },
  appName: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '700',
    color: theme.colors.primary.dark,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[6],
  },
  tagline: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing[4],
    color: theme.colors.neutral.darkest,
  },
  description: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
    color: theme.colors.neutral.dark,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[10],
    gap: theme.spacing[4],
  },
  button: {
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
  },
  primaryButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  secondaryButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
});