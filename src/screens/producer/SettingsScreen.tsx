import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { ProducerStackScreenProps } from '@/navigation/types';

import { theme } from '@/styles/designSystem';
import { useAuthStore } from '@/stores/authStore';

export default function SettingsScreen() {
  const navigation = useNavigation<ProducerStackScreenProps<'Settings'>['navigation']>();
  const { logout } = useAuthStore();
  
  // Mock farm data - in a real app, this would come from a farm store
  const [farm, setFarm] = useState({
    name: 'Green Valley Farm',
    email: 'info@greenvalleyfarm.com',
    phone: '(555) 123-4567',
    address: '1234 Farm Road, Greenville, CA 95667',
    description: 'A family-owned organic farm specializing in seasonal vegetables, fruits, and free-range eggs.',
    hours: {
      monday: { open: '08:00', close: '17:00', isOpen: true },
      tuesday: { open: '08:00', close: '17:00', isOpen: true },
      wednesday: { open: '08:00', close: '17:00', isOpen: true },
      thursday: { open: '08:00', close: '17:00', isOpen: true },
      friday: { open: '08:00', close: '17:00', isOpen: true },
      saturday: { open: '09:00', close: '15:00', isOpen: true },
      sunday: { open: '09:00', close: '15:00', isOpen: false },
    },
    paymentMethods: {
      cash: true,
      creditCard: true,
      paypal: false,
      venmo: true,
    },
  });
  
  // Settings state
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    newOrders: true,
    pickupReminders: true,
    appUpdates: true,
  });
  
  const [preferences, setPreferences] = useState({
    darkMode: false,
    autoConfirmOrders: false,
    showLowStockAlerts: true,
    allowPickupScheduling: true,
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
        <View style={styles.farmSection}>
          <View style={styles.farmImageContainer}>
            <View style={styles.farmImage}>
              <Text style={styles.farmInitials}>{farm.name.split(' ').map(n => n[0]).join('')}</Text>
            </View>
            <TouchableOpacity style={styles.editFarmImageButton}>
              <Ionicons name="camera" size={20} color={theme.colors.neutral.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.farmName}>{farm.name}</Text>
          <Text style={styles.farmEmail}>{farm.email}</Text>
          <TouchableOpacity style={styles.editFarmButton}>
            <Text style={styles.editFarmButtonText}>Edit Farm Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farm Information</Text>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="business-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Farm Details</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral.medium} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="location-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Address & Location</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral.medium} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Business Hours</Text>
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
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Password & Security</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral.medium} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="wallet-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Billing & Subscription</Text>
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
              <Ionicons name="notifications-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>New Orders</Text>
              <Switch
                value={notifications.newOrders}
                onValueChange={(value) => setNotifications({...notifications, newOrders: value})}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={notifications.newOrders ? theme.colors.primary.main : theme.colors.neutral.white}
              />
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="alarm-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Pickup Reminders</Text>
              <Switch
                value={notifications.pickupReminders}
                onValueChange={(value) => setNotifications({...notifications, pickupReminders: value})}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={notifications.pickupReminders ? theme.colors.primary.main : theme.colors.neutral.white}
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
              <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Auto-Confirm Orders</Text>
              <Switch
                value={preferences.autoConfirmOrders}
                onValueChange={(value) => setPreferences({...preferences, autoConfirmOrders: value})}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={preferences.autoConfirmOrders ? theme.colors.primary.main : theme.colors.neutral.white}
              />
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="alert-circle-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Low Stock Alerts</Text>
              <Switch
                value={preferences.showLowStockAlerts}
                onValueChange={(value) => setPreferences({...preferences, showLowStockAlerts: value})}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={preferences.showLowStockAlerts ? theme.colors.primary.main : theme.colors.neutral.white}
              />
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Allow Pickup Scheduling</Text>
              <Switch
                value={preferences.allowPickupScheduling}
                onValueChange={(value) => setPreferences({...preferences, allowPickupScheduling: value})}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={preferences.allowPickupScheduling ? theme.colors.primary.main : theme.colors.neutral.white}
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
  farmSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  farmImageContainer: {
    position: 'relative',
    marginBottom: theme.spacing[3],
  },
  farmImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  farmInitials: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.neutral.white,
  },
  editFarmImageButton: {
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
  farmName: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[1],
  },
  farmEmail: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[4],
  },
  editFarmButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
  },
  editFarmButtonText: {
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