import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { ConsumerStackScreenProps } from '@/navigation/types';

import { theme } from '@/styles/designSystem';
import { useAuthStore } from '@/stores/authStore';

export default function SettingsScreen() {
  const navigation = useNavigation<ConsumerStackScreenProps<'Settings'>['navigation']>();
  const { logout } = useAuthStore();
  
  // Mock user data - in a real app, this would come from a user store
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, CA 12345',
    paymentMethods: [
      { id: '1', type: 'Credit Card', last4: '1234', default: true },
      { id: '2', type: 'PayPal', email: 'john.doe@example.com', default: false },
    ],
  });
  
  // Settings state
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    farmUpdates: true,
    appUpdates: true,
  });
  
  const [preferences, setPreferences] = useState({
    darkMode: false,
    savePaymentInfo: true,
    saveAddress: true,
    useLocation: true,
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => logout(),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.neutral.darkest} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>{user.name.split(' ').map(n => n[0]).join('')}</Text>
            </View>
            <TouchableOpacity style={styles.editProfileImageButton}>
              <Ionicons name="camera" size={20} color={theme.colors.neutral.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="person-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Personal Information</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral.medium} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="location-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Addresses</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral.medium} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="card-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Payment Methods</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral.medium} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Password & Security</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral.medium} />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="cart-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Order Updates</Text>
              <Switch
                value={notifications.orderUpdates}
                onValueChange={(value) => setNotifications({...notifications, orderUpdates: value})}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={notifications.orderUpdates ? theme.colors.primary.main : theme.colors.neutral.white}
              />
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="pricetag-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Promotions & Discounts</Text>
              <Switch
                value={notifications.promotions}
                onValueChange={(value) => setNotifications({...notifications, promotions: value})}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={notifications.promotions ? theme.colors.primary.main : theme.colors.neutral.white}
              />
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="leaf-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Farm Updates</Text>
              <Switch
                value={notifications.farmUpdates}
                onValueChange={(value) => setNotifications({...notifications, farmUpdates: value})}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={notifications.farmUpdates ? theme.colors.primary.main : theme.colors.neutral.white}
              />
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="apps-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>App Updates</Text>
              <Switch
                value={notifications.appUpdates}
                onValueChange={(value) => setNotifications({...notifications, appUpdates: value})}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={notifications.appUpdates ? theme.colors.primary.main : theme.colors.neutral.white}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="moon-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Switch
                value={preferences.darkMode}
                onValueChange={(value) => setPreferences({...preferences, darkMode: value})}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={preferences.darkMode ? theme.colors.primary.main : theme.colors.neutral.white}
              />
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="card-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Save Payment Information</Text>
              <Switch
                value={preferences.savePaymentInfo}
                onValueChange={(value) => setPreferences({...preferences, savePaymentInfo: value})}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={preferences.savePaymentInfo ? theme.colors.primary.main : theme.colors.neutral.white}
              />
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="location-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Save Address</Text>
              <Switch
                value={preferences.saveAddress}
                onValueChange={(value) => setPreferences({...preferences, saveAddress: value})}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={preferences.saveAddress ? theme.colors.primary.main : theme.colors.neutral.white}
              />
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="navigate-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Use Location Services</Text>
              <Switch
                value={preferences.useLocation}
                onValueChange={(value) => setPreferences({...preferences, useLocation: value})}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={preferences.useLocation ? theme.colors.primary.main : theme.colors.neutral.white}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="help-circle-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Help Center</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral.medium} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="chatbubble-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Contact Support</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral.medium} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="document-text-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral.medium} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="shield-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral.medium} />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={theme.colors.error.main} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>HarvestLink v1.0.0</Text>
        </View>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  backButton: {
    padding: theme.spacing[2],
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: theme.spacing[3],
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.neutral.white,
  },
  editProfileImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.neutral.white,
  },
  profileName: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[1],
  },
  profileEmail: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[4],
  },
  editProfileButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
  },
  editProfileButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
  section: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[3],
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.lightest,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary.lightest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[3],
  },
  logoutButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.error.main,
    marginLeft: theme.spacing[2],
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: theme.spacing[6],
  },
  versionText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.medium,
  },
});