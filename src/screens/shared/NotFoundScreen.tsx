import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { theme } from '@/styles/designSystem';

export default function NotFoundScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Text style={styles.emoji}>🌱</Text>
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.message}>
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ConsumerRoot', { screen: 'ConsumerTabs' })}>
          <Text style={styles.buttonText}>Go to Home</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[6],
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing[6],
  },
  title: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '700',
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing[4],
    textAlign: 'center',
  },
  message: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    textAlign: 'center',
    marginBottom: theme.spacing[8],
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  button: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[8],
    borderRadius: theme.borders.radius.md,
  },
  buttonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
});