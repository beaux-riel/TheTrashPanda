import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { ProducerStackScreenProps } from '@/navigation/types';

import { theme } from '@/styles/designSystem';

type RouteParams = {
  orderId: string;
};

export default function OrderDetailsScreen() {
  const navigation = useNavigation<ProducerStackScreenProps<'OrderDetails'>['navigation']>();
  const route = useRoute<ProducerStackScreenProps<'OrderDetails'>['route']>();
  const { orderId } = route.params;
  
  // Mock order data - in a real app, this would come from an API
  const [order, setOrder] = useState({
    id: orderId,
    customerName: 'John Doe',
    customerPhone: '(555) 123-4567',
    customerEmail: 'john.doe@example.com',
    date: 'April 16, 2025',
    status: 'Pending',
    total: '$19.47',
    paymentMethod: 'Credit Card (****1234)',
    paymentStatus: 'Paid',
    deliveryMethod: 'Pickup',
    pickupDate: 'April 18, 2025',
    pickupTime: '10:00 AM - 12:00 PM',
    items: [
      { id: '1', name: 'Fresh Strawberries', price: '$4.99', quantity: 2, unit: 'pint', total: '$9.98' },
      { id: '2', name: 'Heirloom Tomatoes', price: '$3.99', quantity: 1, unit: 'lb', total: '$3.99' },
      { id: '3', name: 'Free-Range Eggs', price: '$5.50', quantity: 1, unit: 'dozen', total: '$5.50' },
    ],
    subtotal: '$19.47',
    tax: '$0.00',
    total: '$19.47',
    notes: 'Please make sure the strawberries are ripe.',
  });

  const updateOrderStatus = (newStatus: string) => {
    setOrder({
      ...order,
      status: newStatus,
    });
    
    Alert.alert(
      'Order Status Updated',
      `Order status has been updated to ${newStatus}.`,
      [{ text: 'OK' }]
    );
  };

  const contactCustomer = () => {
    Alert.alert(
      'Contact Customer',
      'How would you like to contact the customer?',
      [
        {
          text: 'Call',
          onPress: () => {
            // In a real app, this would open the phone app
            console.log(`Calling ${order.customerPhone}`);
          },
        },
        {
          text: 'Email',
          onPress: () => {
            // In a real app, this would open the email app
            console.log(`Emailing ${order.customerEmail}`);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
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
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity 
          style={styles.printButton}
          onPress={() => {/* Handle print */}}
        >
          <Ionicons name="print-outline" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Order ID:</Text>
            <Text style={styles.orderId}>{order.id}</Text>
          </View>
          <View style={styles.orderDateContainer}>
            <Text style={styles.orderDateLabel}>Date:</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
        </View>
        
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
            <View style={styles.statusActions}>
              <TouchableOpacity 
                style={[styles.statusButton, order.status === 'Confirmed' && styles.statusButtonActive]}
                onPress={() => updateOrderStatus('Confirmed')}
                disabled={order.status === 'Confirmed'}
              >
                <Text style={[styles.statusButtonText, order.status === 'Confirmed' && styles.statusButtonTextActive]}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statusButton, order.status === 'Ready' && styles.statusButtonActive]}
                onPress={() => updateOrderStatus('Ready')}
                disabled={order.status === 'Ready'}
              >
                <Text style={[styles.statusButtonText, order.status === 'Ready' && styles.statusButtonTextActive]}>Ready</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statusButton, order.status === 'Completed' && styles.statusButtonActive]}
                onPress={() => updateOrderStatus('Completed')}
                disabled={order.status === 'Completed'}
              >
                <Text style={[styles.statusButtonText, order.status === 'Completed' && styles.statusButtonTextActive]}>Complete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statusButton, order.status === 'Cancelled' && styles.statusButtonCancelled]}
                onPress={() => updateOrderStatus('Cancelled')}
                disabled={order.status === 'Cancelled'}
              >
                <Text style={[styles.statusButtonText, order.status === 'Cancelled' && styles.statusButtonTextCancelled]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{order.customerName}</Text>
            <Text style={styles.customerDetail}>{order.customerPhone}</Text>
            <Text style={styles.customerDetail}>{order.customerEmail}</Text>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={contactCustomer}
            >
              <Ionicons name="call-outline" size={16} color={theme.colors.primary.main} />
              <Text style={styles.contactButtonText}>Contact Customer</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemImage} />
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <View style={styles.orderItemDetails}>
                  <Text style={styles.orderItemQuantity}>{item.quantity} × {item.price}/{item.unit}</Text>
                  <Text style={styles.orderItemTotal}>{item.total}</Text>
                </View>
              </View>
            </View>
          ))}
          
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{order.subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>{order.tax}</Text>
            </View>
            <View style={styles.summaryRowTotal}>
              <Text style={styles.summaryLabelTotal}>Total</Text>
              <Text style={styles.summaryValueTotal}>{order.total}</Text>
            </View>
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
              <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.success.main} />
              <Text style={styles.infoText}>Payment Status: {order.paymentStatus}</Text>
            </View>
          </View>
        </View>
        
        {order.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Notes</Text>
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{order.notes}</Text>
            </View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.scheduleButton}
          onPress={() => navigation.navigate('PickupSchedule')}
        >
          <Text style={styles.scheduleButtonText}>View Pickup Schedule</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Helper function to get status badge styles
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Pending':
      return styles.statusPending;
    case 'Confirmed':
      return styles.statusConfirmed;
    case 'Ready':
      return styles.statusReady;
    case 'Completed':
      return styles.statusCompleted;
    case 'Cancelled':
      return styles.statusCancelled;
    default:
      return styles.statusPending;
  }
};

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
  printButton: {
    padding: theme.spacing[2],
  },
  scrollView: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.neutral.lightest,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIdLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginRight: theme.spacing[1],
  },
  orderId: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  orderDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDateLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginRight: theme.spacing[1],
  },
  orderDate: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
  },
  statusSection: {
    padding: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
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
    marginBottom: theme.spacing[3],
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borders.radius.full,
    marginBottom: theme.spacing[4],
  },
  statusPending: {
    backgroundColor: theme.colors.warning.light,
  },
  statusConfirmed: {
    backgroundColor: theme.colors.info.light,
  },
  statusReady: {
    backgroundColor: theme.colors.primary.light,
  },
  statusCompleted: {
    backgroundColor: theme.colors.success.light,
  },
  statusCancelled: {
    backgroundColor: theme.colors.error.light,
  },
  statusText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  statusActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statusButton: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    marginHorizontal: theme.spacing[1],
    marginBottom: theme.spacing[2],
  },
  statusButtonActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  statusButtonCancelled: {
    backgroundColor: theme.colors.error.main,
    borderColor: theme.colors.error.main,
  },
  statusButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
  },
  statusButtonTextActive: {
    color: theme.colors.neutral.white,
  },
  statusButtonTextCancelled: {
    color: theme.colors.neutral.white,
  },
  customerInfo: {
    backgroundColor: theme.colors.neutral.lightest,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing[4],
  },
  customerName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[2],
  },
  customerDetail: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[1],
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing[3],
  },
  contactButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.primary.main,
    marginLeft: theme.spacing[2],
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing[3],
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
  orderItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemQuantity: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
  },
  orderItemTotal: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.secondary.dark,
  },
  orderSummary: {
    marginTop: theme.spacing[4],
    paddingTop: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.light,
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
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing[2],
    paddingTop: theme.spacing[2],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.light,
  },
  summaryLabelTotal: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  summaryValueTotal: {
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
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  infoText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginLeft: theme.spacing[3],
  },
  paymentInfo: {
    backgroundColor: theme.colors.neutral.lightest,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing[4],
  },
  notesContainer: {
    backgroundColor: theme.colors.neutral.lightest,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing[4],
  },
  notesText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    fontStyle: 'italic',
  },
  footer: {
    padding: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.light,
    backgroundColor: theme.colors.neutral.white,
  },
  scheduleButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing[3],
    alignItems: 'center',
  },
  scheduleButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
});