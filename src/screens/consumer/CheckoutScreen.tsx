import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { ConsumerStackScreenProps } from '@/navigation/types';

import { theme } from '@/styles/designSystem';

export default function CheckoutScreen() {
  const navigation = useNavigation<ConsumerStackScreenProps<'Checkout'>['navigation']>();
  
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [pickupMethod, setPickupMethod] = useState('pickup');
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);

  // Mock cart data - in a real app, this would come from a cart store
  const cartItems = [
    { id: '1', name: 'Fresh Strawberries', farm: 'Green Valley Farm', price: '$4.99', quantity: 2, unit: 'pint' },
    { id: '2', name: 'Heirloom Tomatoes', farm: 'Green Valley Farm', price: '$3.99', quantity: 1, unit: 'lb' },
    { id: '3', name: 'Free-Range Eggs', farm: 'Sunny Acres', price: '$5.50', quantity: 1, unit: 'dozen' },
  ];

  const subtotal = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.price.replace('$', '')) * item.quantity);
  }, 0);
  
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = pickupMethod === 'delivery' ? 5.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const placeOrder = () => {
    // In a real app, this would submit the order to the backend
    // For now, just navigate to the order confirmation screen
    navigation.navigate('OrderConfirmation', { orderId: 'ORD-' + Math.floor(Math.random() * 10000) });
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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.cartItemImage} />
              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemFarm}>{item.farm}</Text>
                <View style={styles.cartItemPriceRow}>
                  <Text style={styles.cartItemPrice}>${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</Text>
                  <Text style={styles.cartItemQuantity}>{item.quantity} × {item.price}/{item.unit}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Method</Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity 
              style={[styles.optionButton, pickupMethod === 'pickup' && styles.optionButtonSelected]}
              onPress={() => setPickupMethod('pickup')}
            >
              <Ionicons 
                name="location" 
                size={24} 
                color={pickupMethod === 'pickup' ? theme.colors.primary.main : theme.colors.neutral.medium} 
              />
              <Text style={[styles.optionText, pickupMethod === 'pickup' && styles.optionTextSelected]}>Pickup</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, pickupMethod === 'delivery' && styles.optionButtonSelected]}
              onPress={() => setPickupMethod('delivery')}
            >
              <Ionicons 
                name="car" 
                size={24} 
                color={pickupMethod === 'delivery' ? theme.colors.primary.main : theme.colors.neutral.medium} 
              />
              <Text style={[styles.optionText, pickupMethod === 'delivery' && styles.optionTextSelected]}>Delivery</Text>
            </TouchableOpacity>
          </View>
          
          {pickupMethod === 'pickup' ? (
            <View style={styles.pickupInfo}>
              <Text style={styles.pickupTitle}>Pickup Location</Text>
              <Text style={styles.pickupAddress}>Green Valley Farm</Text>
              <Text style={styles.pickupAddress}>1234 Farm Road, Greenville, CA 95667</Text>
              <Text style={styles.pickupHours}>Available: Mon-Sat, 8am-5pm</Text>
            </View>
          ) : (
            <View style={styles.deliveryInfo}>
              <Text style={styles.inputLabel}>Delivery Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Street Address"
                placeholderTextColor={theme.colors.neutral.medium}
              />
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 2, marginRight: theme.spacing[2] }]}
                  placeholder="City"
                  placeholderTextColor={theme.colors.neutral.medium}
                />
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: theme.spacing[2] }]}
                  placeholder="State"
                  placeholderTextColor={theme.colors.neutral.medium}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="ZIP"
                  placeholderTextColor={theme.colors.neutral.medium}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Save address for future orders</Text>
                <Switch
                  value={saveAddress}
                  onValueChange={setSaveAddress}
                  trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                  thumbColor={saveAddress ? theme.colors.primary.main : theme.colors.neutral.white}
                />
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity 
              style={[styles.optionButton, paymentMethod === 'creditCard' && styles.optionButtonSelected]}
              onPress={() => setPaymentMethod('creditCard')}
            >
              <Ionicons 
                name="card" 
                size={24} 
                color={paymentMethod === 'creditCard' ? theme.colors.primary.main : theme.colors.neutral.medium} 
              />
              <Text style={[styles.optionText, paymentMethod === 'creditCard' && styles.optionTextSelected]}>Credit Card</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, paymentMethod === 'paypal' && styles.optionButtonSelected]}
              onPress={() => setPaymentMethod('paypal')}
            >
              <Ionicons 
                name="logo-paypal" 
                size={24} 
                color={paymentMethod === 'paypal' ? theme.colors.primary.main : theme.colors.neutral.medium} 
              />
              <Text style={[styles.optionText, paymentMethod === 'paypal' && styles.optionTextSelected]}>PayPal</Text>
            </TouchableOpacity>
          </View>
          
          {paymentMethod === 'creditCard' && (
            <View style={styles.paymentInfo}>
              <Text style={styles.inputLabel}>Card Information</Text>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                placeholderTextColor={theme.colors.neutral.medium}
                keyboardType="number-pad"
              />
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: theme.spacing[2] }]}
                  placeholder="MM/YY"
                  placeholderTextColor={theme.colors.neutral.medium}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="CVV"
                  placeholderTextColor={theme.colors.neutral.medium}
                  keyboardType="number-pad"
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Name on Card"
                placeholderTextColor={theme.colors.neutral.medium}
              />
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Save payment information</Text>
                <Switch
                  value={savePaymentInfo}
                  onValueChange={setSavePaymentInfo}
                  trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                  thumbColor={savePaymentInfo ? theme.colors.primary.main : theme.colors.neutral.white}
                />
              </View>
            </View>
          )}
          
          {paymentMethod === 'paypal' && (
            <View style={styles.paypalInfo}>
              <TouchableOpacity style={styles.paypalButton}>
                <Text style={styles.paypalButtonText}>Connect with PayPal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Subtotal</Text>
            <Text style={styles.orderDetailValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Tax</Text>
            <Text style={styles.orderDetailValue}>${tax.toFixed(2)}</Text>
          </View>
          {pickupMethod === 'delivery' && (
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Delivery Fee</Text>
              <Text style={styles.orderDetailValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.orderTotalRow}>
            <Text style={styles.orderTotalLabel}>Total</Text>
            <Text style={styles.orderTotalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={placeOrder}
        >
          <Text style={styles.placeOrderButtonText}>Place Order - ${total.toFixed(2)}</Text>
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
  cartItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing[4],
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borders.radius.md,
    backgroundColor: theme.colors.neutral.light,
    marginRight: theme.spacing[3],
  },
  cartItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[1],
  },
  cartItemFarm: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing[1],
  },
  cartItemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemPrice: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.secondary.dark,
  },
  cartItemQuantity: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
  },
  optionContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing[4],
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    borderRadius: theme.borders.radius.md,
    marginRight: theme.spacing[2],
  },
  optionButtonSelected: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.lightest,
  },
  optionText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginLeft: theme.spacing[2],
  },
  optionTextSelected: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  pickupInfo: {
    backgroundColor: theme.colors.neutral.lightest,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing[4],
  },
  pickupTitle: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[2],
  },
  pickupAddress: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[1],
  },
  pickupHours: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
    marginTop: theme.spacing[2],
  },
  deliveryInfo: {
    marginBottom: theme.spacing[2],
  },
  inputLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[2],
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing[3],
    marginBottom: theme.spacing[3],
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing[2],
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing[2],
  },
  switchLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
  },
  paymentInfo: {
    marginBottom: theme.spacing[2],
  },
  paypalInfo: {
    alignItems: 'center',
    marginTop: theme.spacing[2],
  },
  paypalButton: {
    backgroundColor: '#0070BA', // PayPal blue
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
  },
  paypalButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  orderDetailLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
  },
  orderDetailValue: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
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
  footer: {
    padding: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.light,
    backgroundColor: theme.colors.neutral.white,
  },
  placeOrderButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing[3],
    alignItems: 'center',
  },
  placeOrderButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
});