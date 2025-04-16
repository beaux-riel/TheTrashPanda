import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { ConsumerStackScreenProps } from '@/navigation/types';

import { theme } from '@/styles/designSystem';

type RouteParams = {
  orderId: string;
};

export default function OrderConfirmationScreen() {
  const navigation = useNavigation<ConsumerStackScreenProps<'OrderConfirmation'>['navigation']>();
  const route = useRoute<ConsumerStackScreenProps<'OrderConfirmation'>['route']>();
  const { orderId } = route.params;

  // Mock order data - in a real app, this would come from an API
  const order = {
    id: orderId,
    date: 'April 16, 2025',
    status: 'Confirmed',
    total: '$19.47',
    paymentMethod: 'Credit Card (****1234)',
    deliveryMethod: 'Pickup',
    pickupLocation: 'Green Valley Farm',
    pickupAddress: '1234 Farm Road, Greenville, CA 95667',
    pickupDate: 'April 18, 2025',
    pickupTime: '10:00 AM - 12:00 PM',
    items: [
      { id: '1', name: 'Fresh Strawberries', farm: 'Green Valley Farm', price: '$4.99', quantity: 2, unit: 'pint' },
      { id: '2', name: 'Heirloom Tomatoes', farm: 'Green Valley Farm', price: '$3.99', quantity: 1, unit: 'lb' },
      { id: '3', name: 'Free-Range Eggs', farm: 'Sunny Acres', price: '$5.50', quantity: 1, unit: 'dozen' },
    ]
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.navigate('ConsumerTabs', { screen: 'Home' })}
        >
          <Ionicons name="close" size={24} color={theme.colors.neutral.darkest} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.confirmationHeader}>
          <View style={styles.checkmarkCircle}>
            <Ionicons name="checkmark" size={48} color={theme.colors.success.main} />
          </View>
          <Text style={styles.confirmationTitle}>Order Confirmed!</Text>
          <Text style={styles.confirmationSubtitle}>Your order has been placed successfully.</Text>
          <Text style={styles.orderIdText}>Order ID: {order.id}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemImage} />
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemFarm}>{item.farm}</Text>
                <View style={styles.orderItemPriceRow}>
                  <Text style={styles.orderItemPrice}>${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</Text>
                  <Text style={styles.orderItemQuantity}>{item.quantity} × {item.price}/{item.unit}</Text>
                </View>
              </View>
            </View>
          ))}
          
          <View style={styles.orderTotalRow}>
            <Text style={styles.orderTotalLabel}>Total</Text>
            <Text style={styles.orderTotalValue}>{order.total}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Information</Text>
          <View style={styles.pickupInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.neutral.dark} />
              <Text style={styles.infoText}>{order.pickupDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color={theme.colors.neutral.dark} />
              <Text style={styles.infoText}>{order.pickupTime}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={theme.colors.neutral.dark} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{order.pickupLocation}</Text>
                <Text style={styles.locationAddress}>{order.pickupAddress}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.paymentInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={20} color={theme.colors.neutral.dark} />
              <Text style={styles.infoText}>{order.paymentMethod}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.neutral.dark} />
              <Text style={styles.infoText}>Order Date: {order.date}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            If you have any questions or need to make changes to your order, please contact the farm directly or visit our help center.
          </Text>
          <View style={styles.helpButtonsRow}>
            <TouchableOpacity style={styles.helpButton}>
              <Ionicons name="call-outline" size={20} color={theme.colors.primary.main} />
              <Text style={styles.helpButtonText}>Contact Farm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpButton}>
              <Ionicons name="help-circle-outline" size={20} color={theme.colors.primary.main} />
              <Text style={styles.helpButtonText}>Help Center</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.viewOrderButton}
          onPress={() => navigation.navigate('ConsumerTabs', { screen: 'Orders' })}
        >
          <Text style={styles.viewOrderButtonText}>View My Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.continueShoppingButton}
          onPress={() => navigation.navigate('ConsumerTabs', { screen: 'Home' })}
        >
          <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
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
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  closeButton: {
    padding: theme.spacing[2],
  },
  scrollView: {
    flex: 1,
  },
  confirmationHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.primary.lightest,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
    shadowColor: theme.colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmationTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing[2],
  },
  confirmationSubtitle: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[3],
    textAlign: 'center',
  },
  orderIdText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
    backgroundColor: theme.colors.neutral.white,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borders.radius.full,
  },
  section: {
    padding: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[4],
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing[4],
  },
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borders.radius.md,
    backgroundColor: theme.colors.neutral.light,
    marginRight: theme.spacing[3],
  },
  orderItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  orderItemName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[1],
  },
  orderItemFarm: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing[1],
  },
  orderItemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemPrice: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.secondary.dark,
  },
  orderItemQuantity: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
  },
  orderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing[3],
    paddingTop: theme.spacing[3],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.light,
  },
  orderTotalLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  orderTotalValue: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.primary.dark,
  },
  pickupInfo: {
    backgroundColor: theme.colors.neutral.lightest,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing[4],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  infoText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginLeft: theme.spacing[3],
    flex: 1,
  },
  locationInfo: {
    marginLeft: theme.spacing[3],
    flex: 1,
  },
  locationName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[1],
  },
  locationAddress: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
  },
  paymentInfo: {
    backgroundColor: theme.colors.neutral.lightest,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing[4],
  },
  helpSection: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.neutral.lightest,
    marginTop: theme.spacing[4],
    marginHorizontal: theme.spacing[4],
    borderRadius: theme.borders.radius.lg,
    marginBottom: theme.spacing[8],
  },
  helpTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[2],
  },
  helpText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[4],
  },
  helpButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    flex: 1,
    marginHorizontal: theme.spacing[2],
    shadowColor: theme.colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  helpButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.primary.main,
    marginLeft: theme.spacing[2],
  },
  footer: {
    padding: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.light,
    backgroundColor: theme.colors.neutral.white,
  },
  viewOrderButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing[3],
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  viewOrderButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
  continueShoppingButton: {
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing[3],
    alignItems: 'center',
  },
  continueShoppingButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
});