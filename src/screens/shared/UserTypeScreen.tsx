import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { AuthStackScreenProps } from '@/navigation/types';
import { theme } from '@/styles/designSystem';
import { useAuthStore } from '@/stores/authStore';
import { UserType } from '@/stores/authStore';

export default function UserTypeScreen() {
  const navigation = useNavigation<AuthStackScreenProps<'UserType'>['navigation']>();
  const { setUserType, login } = useAuthStore();
  
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedType) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would update the user's profile in the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser = {
        id: '123',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userType: selectedType,
        profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      };
      
      // Set user type and log in
      setUserType(selectedType);
      login(mockUser, 'mock-token-123');
    } catch (err) {
      console.error('Failed to set user type:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.neutral.darkest} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Account Type</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.titleText}>How will you use HarvestLink?</Text>
        <Text style={styles.subtitleText}>
          Select the option that best describes you. You can change this later in your profile settings.
        </Text>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedType === 'consumer' && styles.selectedCard,
            ]}
            onPress={() => setSelectedType('consumer')}>
            <View style={styles.optionIconContainer}>
              <Ionicons name="basket-outline" size={48} color={theme.colors.primary.main} />
            </View>
            <Text style={styles.optionTitle}>I'm a Consumer</Text>
            <Text style={styles.optionDescription}>
              I want to discover and purchase fresh produce directly from local farms
            </Text>
            {selectedType === 'consumer' && (
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary.main} />
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedType === 'producer' && styles.selectedCard,
            ]}
            onPress={() => setSelectedType('producer')}>
            <View style={styles.optionIconContainer}>
              <Ionicons name="leaf-outline" size={48} color={theme.colors.primary.dark} />
            </View>
            <Text style={styles.optionTitle}>I'm a Producer</Text>
            <Text style={styles.optionDescription}>
              I want to sell my farm products directly to consumers and manage my farm business
            </Text>
            {selectedType === 'producer' && (
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary.main} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedType || isLoading) && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedType || isLoading}>
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Setting up your account...' : 'Continue'}
          </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  backButton: {
    padding: theme.spacing[2],
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[6],
  },
  titleText: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[2],
  },
  subtitleText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[8],
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  optionsContainer: {
    gap: theme.spacing[6],
  },
  optionCard: {
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing[5],
    backgroundColor: theme.colors.neutral.white,
    shadowColor: theme.colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  selectedCard: {
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
    backgroundColor: theme.colors.primary.lightest,
  },
  optionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borders.radius.full,
    backgroundColor: theme.colors.primary.lightest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  optionTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[2],
  },
  optionDescription: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: theme.spacing[3],
    right: theme.spacing[3],
  },
  footer: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[10],
    paddingTop: theme.spacing[4],
  },
  continueButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.neutral.medium,
  },
  continueButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
});