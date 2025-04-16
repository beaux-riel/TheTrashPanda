import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { ConsumerTabScreenProps } from '@/navigation/types';
import { theme } from '@/styles/designSystem';

// Mock orders data
const mockOrders = [
  {
    id: '1',
    orderNumber: 'HL-12345',
    farmId: '1',
    farmName: 'Green Valley Farm',
    date: 'May 15, 2023',
    status: 'Completed',
    items: [
      { name: 'Fresh Strawberries', quantity: 2, price: 4.99 },
      { name: 'Organic Spinach', quantity: 1, price: 3.49 },
      { name: 'Heirloom Tomatoes', quantity: 2, price: 5.99 },
    ],
    total: 24.45,
  },
  {
    id: '2',
    orderNumber: 'HL-12346',
    farmId: '2',
    farmName: 'Sunny Acres',
    date: 'May 10, 2023',
    status: 'Completed',
    items: [
      { name: 'Free-Range Eggs', quantity: 1, price: 5.50 },
      { name: 'Whole Chicken', quantity: 1, price: 12.99 },
    ],
    total: 18.49,
  },
  {
    id: '3',
    orderNumber: 'HL-12347',
    farmId: '3',
    farmName: 'Hillside Dairy',
    date: 'May 5, 2023',
    status: 'Completed',
    items: [
      { name: 'Artisan Cheese', quantity: 1, price: 7.50 },
      { name: 'Organic Milk', quantity: 2, price: 4.99 },
      { name: 'Yogurt', quantity: 1, price: 3.99 },
    ],
    total: 21.47,
  },
  {
    id: '4',
    orderNumber: 'HL-12348',
    farmId: '1',
    farmName: 'Green Valley Farm',
    date: 'April 28, 2023',
    status: 'Completed',
    items: [
      { name: 'Fresh Strawberries', quantity: 1, price: 4.99 },
      { name: 'Blueberries', quantity: 1, price: 6.99 },
    ],
    total: 11.98,
  },
];

// Tab options for filtering orders
const tabOptions = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

export default function OrdersScreen() {
  const navigation = useNavigation<ConsumerTabScreenProps<'Orders'>['navigation']>();
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter orders based on active tab
  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return order.status !== 'Completed';
    if (activeTab === 'completed') return order.status === 'Completed';
    return true;
  });
  
  const renderOrderItem = ({ item }: { item: typeof mockOrders[0] }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderConfirmation', { orderId: item.id })}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.farmInfo}>
        <Text style={styles.farmName}>{item.farmName}</Text>
      </View>
      
      <View style={styles.orderItems}>
        {item.items.map((orderItem, index) => (
          <Text key={index} style={styles.orderItemText}>
            {orderItem.quantity}x {orderItem.name}
          </Text>
        ))}
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
      </View>
      
      <View style={styles.orderActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('FarmProfile', { farmId: item.farmId })}>
          <Text style={styles.actionButtonText}>View Farm</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.primaryActionButton]}>
          <Text style={styles.primaryActionButtonText}>Reorder</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  // Helper function to get status badge style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return styles.pendingStatus;
      case 'Processing':
        return styles.processingStatus;
      case 'Ready':
        return styles.readyStatus;
      case 'Completed':
        return styles.completedStatus;
      case 'Cancelled':
        return styles.cancelledStatus;
      default:
        return {};
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Orders</Text>
      </View>
      
      <View style={styles.tabContainer}>
        {tabOptions.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}>
            <Text
              style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="receipt-outline" size={64} color={theme.colors.neutral.light} />
          </View>
          <Text style={styles.emptyTitle}>No orders found</Text>
          <Text style={styles.emptyText}>
            You don't have any {activeTab !== 'all' ? activeTab.toLowerCase() : ''} orders yet.
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
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.neutral.darkest,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[6],
    marginBottom: theme.spacing[4],
  },
  tab: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    marginRight: theme.spacing[2],
    borderRadius: theme.borders.radius.full,
    backgroundColor: theme.colors.neutral.lightest,
  },
  activeTab: {
    backgroundColor: theme.colors.primary.main,
  },
  tabText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.neutral.dark,
  },
  activeTabText: {
    color: theme.colors.neutral.white,
  },
  ordersList: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[6],
  },
  orderCard: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borders.radius.lg,
    marginBottom: theme.spacing[4],
    padding: theme.spacing[4],
    shadowColor: theme.colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  orderNumber: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[1],
  },
  orderDate: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borders.radius.full,
  },
  pendingStatus: {
    backgroundColor: theme.colors.warning.lightest,
  },
  processingStatus: {
    backgroundColor: theme.colors.info.lightest,
  },
  readyStatus: {
    backgroundColor: theme.colors.success.lightest,
  },
  completedStatus: {
    backgroundColor: theme.colors.success.lightest,
  },
  cancelledStatus: {
    backgroundColor: theme.colors.error.lightest,
  },
  statusText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '500',
    color: theme.colors.neutral.darkest,
  },
  farmInfo: {
    marginBottom: theme.spacing[3],
  },
  farmName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    color: theme.colors.primary.main,
  },
  orderItems: {
    marginBottom: theme.spacing[3],
  },
  orderItemText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[1],
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing[3],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.light,
    marginBottom: theme.spacing[3],
  },
  totalLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    color: theme.colors.neutral.darkest,
  },
  totalValue: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '700',
    color: theme.colors.primary.dark,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing[3],
  },
  actionButton: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
  },
  actionButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.neutral.dark,
  },
  primaryActionButton: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  primaryActionButtonText: {
    color: theme.colors.neutral.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[6],
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: theme.borders.radius.full,
    backgroundColor: theme.colors.neutral.lightest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[2],
  },
  emptyText: {
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