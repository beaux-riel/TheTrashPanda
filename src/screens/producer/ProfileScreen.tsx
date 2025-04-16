import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { ProducerTabScreenProps } from '@/navigation/types';
import { theme } from '@/styles/designSystem';
import { useAuthStore } from '@/stores/authStore';

// Menu sections
const menuSections = [
  {
    title: 'Farm Profile',
    items: [
      { id: 'farm', label: 'Farm Information', icon: 'business-outline' },
      { id: 'photos', label: 'Farm Photos', icon: 'images-outline' },
      { id: 'description', label: 'Farm Description', icon: 'document-text-outline' },
      { id: 'categories', label: 'Product Categories', icon: 'list-outline' },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'profile', label: 'Personal Information', icon: 'person-outline' },
      { id: 'payment', label: 'Payment Methods', icon: 'card-outline' },
      { id: 'bank', label: 'Bank Account', icon: 'cash-outline' },
      { id: 'notifications', label: 'Notification Settings', icon: 'notifications-outline' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help', label: 'Help Center', icon: 'help-circle-outline' },
      { id: 'contact', label: 'Contact Us', icon: 'mail-outline' },
      { id: 'about', label: 'About HarvestLink', icon: 'information-circle-outline' },
      { id: 'terms', label: 'Terms & Privacy Policy', icon: 'document-text-outline' },
    ],
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation<ProducerTabScreenProps<'Profile'>['navigation']>();
  const { user, logout } = useAuthStore();
  
  const handleMenuItemPress = (id: string) => {
    // Handle menu item press
    if (id === 'farm') {
      // Navigate to farm information
    } else if (id === 'photos') {
      // Navigate to farm photos
    } else if (id === 'description') {
      // Navigate to farm description
    } else if (id === 'categories') {
      // Navigate to product categories
    } else if (id === 'profile') {
      // Navigate to personal information
    } else if (id === 'payment') {
      // Navigate to payment methods
    } else if (id === 'bank') {
      // Navigate to bank account
    } else if (id === 'notifications') {
      // Navigate to notification settings
    } else if (id === 'help') {
      // Navigate to help center
    } else if (id === 'contact') {
      // Navigate to contact us
    } else if (id === 'about') {
      // Navigate to about
    } else if (id === 'terms') {
      // Navigate to terms and privacy policy
    }
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color={theme.colors.neutral.darkest} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.farmCard}>
          <View style={styles.farmImageContainer}>
            <View style={styles.farmImagePlaceholder}>
              <Text style={styles.farmInitials}>GV</Text>
            </View>
          </View>
          
          <View style={styles.farmInfo}>
            <Text style={styles.farmName}>Green Valley Farm</Text>
            <Text style={styles.farmLocation}>Oakville, CA</Text>
            <TouchableOpacity style={styles.editFarmButton}>
              <Text style={styles.editFarmText}>Edit Farm Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>32</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
        
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileInitials}>
                  {user?.firstName?.[0] || ''}
                  {user?.lastName?.[0] || ''}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  itemIndex === section.items.length - 1 && styles.lastMenuItem,
                ]}
                onPress={() => handleMenuItemPress(item.id)}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon as any} size={24} color={theme.colors.neutral.dark} />
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral.medium} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={theme.colors.error.main} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.neutral.darkest,
  },
  settingsButton: {
    padding: theme.spacing[2],
  },
  scrollView: {
    flex: 1,
  },
  farmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  farmImageContainer: {
    marginRight: theme.spacing[4],
  },
  farmImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: theme.borders.radius.full,
    backgroundColor: theme.colors.primary.lightest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  farmInitials: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.primary.dark,
  },
  farmInfo: {
    flex: 1,
  },
  farmName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[1],
  },
  farmLocation: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[2],
  },
  editFarmButton: {
    alignSelf: 'flex-start',
  },
  editFarmText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.primary.main,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[6],
    marginBottom: theme.spacing[4],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
    borderRightWidth: 1,
    borderRightColor: theme.colors.neutral.light,
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral.dark,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    marginBottom: theme.spacing[4],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.neutral.lightest,
  },
  profileImageContainer: {
    marginRight: theme.spacing[4],
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borders.radius.full,
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: theme.borders.radius.full,
    backgroundColor: theme.colors.neutral.lightest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.dark,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[1],
  },
  profileEmail: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[2],
  },
  editProfileButton: {
    alignSelf: 'flex-start',
  },
  editProfileText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.primary.main,
  },
  menuSection: {
    marginBottom: theme.spacing[6],
  },
  menuSectionTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    paddingHorizontal: theme.spacing[6],
    marginBottom: theme.spacing[2],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.lightest,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
    marginLeft: theme.spacing[3],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[4],
    marginHorizontal: theme.spacing[6],
    marginBottom: theme.spacing[4],
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.error.light,
  },
  logoutText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    color: theme.colors.error.main,
    marginLeft: theme.spacing[2],
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[10],
  },
  versionText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.medium,
  },
});