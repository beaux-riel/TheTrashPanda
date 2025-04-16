import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { ConsumerTabScreenProps } from '@/navigation/types';
import { theme } from '@/styles/designSystem';
import { useCartStore } from '@/stores/cartStore';

// Mock cart items
const mockCartItems = [
  {
    id: '1',
    productId: '101',
    farmId: '1',
    name: 'Fresh Strawberries',
    price: 4.99,
    unit: 'pint',
    quantity: 2,
    imageUrl: '',
  },
  {
    id: '2',
    productId: '102',
    farmId: '1',
    name: 'Organic Spinach',
    price: 3.49,
    unit: 'bunch',
    quantity: 1,
    imageUrl: '',
  },
  {
    id: '3',
    productId: '103',
    farmId: '1',
    name: 'Heirloom Tomatoes',
    price: 5.99,
    unit: 'lb',
    quantity: 2,
    imageUrl: '',
  },
];

export default function CartScreen() {
  const navigation = useNavigation<ConsumerTabScreenProps<'Cart'>['navigation']>();
  const [cartItems, setCartItems] = useState(mockCartItems);
  
  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = 3.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;
  
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(
        cartItems.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
      );
    }
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  
  const renderCartItem = ({ item }: { item: typeof mockCartItems[0] }) => (
    <View style={styles.cartItem}>
      <View style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>
          ${item.price.toFixed(2)} / {item.unit}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}>
            <Ionicons name="remove" size={16} color={theme.colors.neutral.darkest} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}>
            <Ionicons name="add" size={16} color={theme.colors.neutral.darkest} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemTotalContainer}>
        <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => updateQuantity(item.id, 0)}>
          <Ionicons name="trash-outline" size={20} color={theme.colors.error.main} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {cartItems.length > 0 ? (
        <>
          <View style={styles.farmInfoContainer}>
            <View style={styles.farmInfo}>
              <Text style={styles.farmName}>Green Valley Farm</Text>
              <Text style={styles.farmDistance}>3.2 miles away</Text>
            </View>
            <TouchableOpacity
              style={styles.viewFarmButton}
              onPress={() => navigation.navigate('FarmProfile', { farmId: '1' })}>
              <Text style={styles.viewFarmText}>View Farm</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.cartList}
          />
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Tax</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Checkout')}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyCartContainer}>
          <View style={styles.emptyCartIconContainer}>
            <Ionicons name="cart-outline" size={80} color={theme.colors.neutral.light} />
          </View>
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartText}>
            Looks like you haven't added any products to your cart yet.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.exploreButtonText}>Explore Farms</Text>
          </TouchableOpacity>
        </View>
      )}
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
  clearButton: {
    padding: theme.spacing[2],
  },
  clearButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error.main,
    fontWeight: '500',
  },
  farmInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.neutral.lightest,
    marginBottom: theme.spacing[4],
  },
  farmInfo: {
    flex: 1,
  },
  farmName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[1],
  },
  farmDistance: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
  },
  viewFarmButton: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  viewFarmText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    fontWeight: '500',
  },
  cartList: {
    paddingHorizontal: theme.spacing[6],
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: theme.borders.radius.md,
    backgroundColor: theme.colors.neutral.light,
    marginRight: theme.spacing[3],
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[1],
  },
  productPrice: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[2],
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: theme.borders.radius.sm,
    backgroundColor: theme.colors.neutral.lightest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    color: theme.colors.neutral.darkest,
    paddingHorizontal: theme.spacing[3],
  },
  itemTotalContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing[2],
  },
  itemTotal: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  removeButton: {
    padding: theme.spacing[1],
  },
  summaryContainer: {
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    backgroundColor: theme.colors.neutral.lightest,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  summaryLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
  },
  summaryValue: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.neutral.light,
    marginVertical: theme.spacing[3],
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  totalLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  totalValue: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.primary.dark,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[6],
  },
  emptyCartIconContainer: {
    width: 120,
    height: 120,
    borderRadius: theme.borders.radius.full,
    backgroundColor: theme.colors.neutral.lightest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  emptyCartTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[2],
  },
  emptyCartText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
  },
  exploreButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
});