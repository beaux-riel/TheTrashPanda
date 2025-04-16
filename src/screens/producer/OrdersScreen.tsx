import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { ProducerTabScreenProps } from '@/navigation/types';
import { theme } from '@/styles/designSystem';

// Mock orders data
const mockOrders = [
  {
    id: '1',
    orderNumber: 'HL-12345',
    customerName: 'Sarah Johnson',
    date: 'May 15, 2023',
    time: '10:23 AM',
    status: 'New',
    items: [
      { name: 'Fresh Strawberries', quantity: 2, price: 4.99 },
      { name: 'Organic Spinach', quantity: 1, price: 3.49 },
      { name: 'Heirloom Tomatoes', quantity: 2, price: 5.99 },
    ],
    total: 24.45,
    pickupDate: 'May 17, 2023',
    pickupTime: '2:00 PM - 4:00 PM',
  },
  {
    id: '2',
    orderNumber: 'HL-12346',
    customerName: 'Michael Brown',
    date: 'May 15, 2023',
    time: '9:45 AM',
    status: 'Preparing',
    items: [
      { name: 'Fresh Strawberries', quantity: 1, price: 4.99 },
      { name: 'Blueberries', quantity: 2, price: 6.99 },
    ],
    total: 18.97,
    pickupDate: 'May 17, 2023',
    pickupTime: '10:00 AM - 12:00 PM',
  },
  {
    id: '3',
    orderNumber: 'HL-12347',
    customerName: 'Emily Davis',
    date: 'May 14, 2023',
    time: '3:30 PM',
    status: 'Ready',
    items: [
      { name: 'Organic Spinach', quantity: 2, price: 3.49 },
      { name: 'Heirloom Tomatoes', quantity: 1, price: 5.99 },
      { name: 'Fresh Herbs', quantity: 1, price: 2.99 },
    ],
    total: 15.96,
    pickupDate: 'May 16, 2023',
    pickupTime: '4:00 PM - 6:00 PM',
  },
  {
    id: '4',
    orderNumber: 'HL-12348',
    customerName: 'David Wilson',
    date: 'May 14, 2023',
    time: '11:15 AM',
    status: 'Completed',
    items: [
      { name: 'Fresh Strawberries', quantity: 3, price: 4.99 },
      { name: 'Honey', quantity: 1, price: 8.99 },
    ],
    total: 23.96,
    pickupDate: 'May 15, 2023',
    pickupTime: '2:00 PM - 4:00 PM',
  },
  {
    id: '5',
    orderNumber: 'HL-12349',
    customerName: 'Jennifer Smith',
    date: 'May 13, 2023',
    time: '2:45 PM',
    status: 'Completed',
    items: [
      { name: 'Blueberries', quantity: 2, price: 6.99 },
      { name: 'Organic Spinach', quantity: 1, price: 3.49 },
    ],
    total: 17.47,
    pickupDate: 'May 15, 2023',
    pickupTime: '10:00 AM - 12:00 PM',
  },
];

// Tab options for filtering orders
const tabOptions = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'completed', label: 'Completed' },
];

export default function OrdersScreen() {
  const navigation = useNavigation<ProducerTabScreenProps<'Orders'>['navigation']>();
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter orders based on active tab
  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });
  
  const renderOrderItem = ({ item }: { item: typeof mockOrders[0] }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDateTime}>
            {item.date} at {item.time}
          </Text>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.customerInfo}>
        <Ionicons name="person-outline" size={16} color={theme.colors.neutral.dark} />
        <Text style={styles.customerName}>{item.customerName}</Text>
      </View>
      
      <View style={styles.orderItems}>
        {item.items.map((orderItem, index) => (
          <Text key={index} style={styles.orderItemText}>
            {orderItem.quantity}x {orderItem.name}
          </Text>
        ))}
      </View>
      
      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.pickupLabel}>Pickup</Text>
          <Text style={styles.pickupInfo}>
            {item.pickupDate}, {item.pickupTime}
          </Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
        </View>
      </View>
      
      {item.status !== 'Completed' && (
        <View style={styles.actionButtons}>
          {item.status === 'New' && (
            <TouchableOpacity style={[styles.actionButton, styles.primaryActionButton]}>
              <Text style={styles.primaryActionButtonText}>Start Preparing</Text>
            </TouchableOpacity>
          )}
          
          {item.status === 'Preparing' && (
            <TouchableOpacity style={[styles.actionButton, styles.primaryActionButton]}>
              <Text style={styles.primaryActionButtonText}>Mark as Ready</Text>
            </TouchableOpacity>
          )}
          
          {item.status === 'Ready' && (
            <TouchableOpacity style={[styles.actionButton, styles.primaryActionButton]}>
              <Text style={styles.primaryActionButtonText}>Complete Order</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
  
  // Helper function to get status badge style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'New':
        return styles.newStatus;
      case 'Preparing':
        return styles.preparingStatus;
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
        <Text style={styles.headerTitle}>Orders</Text>
      </View>
      
      <ScrollableTabBar
        tabs={tabOptions}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {mockOrders.filter(o => o.status === 'New').length}
          </Text>
          <Text style={styles.statLabel}>New</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {mockOrders.filter(o => o.status === 'Preparing').length}
          </Text>
          <Text style={styles.statLabel}>Preparing</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {mockOrders.filter(o => o.status === 'Ready').length}
          </Text>
          <Text style={styles.statLabel}>Ready</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {mockOrders.filter(o => o.status === 'Completed').length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
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
        </View>
      )}
    </SafeAreaView>
  );
}

// Scrollable Tab Bar Component
function ScrollableTabBar({ tabs, activeTab, onTabPress }) {
  return (
    <FlatList
      data={tabs}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.tab, activeTab === item.id && styles.activeTab]}
          onPress={() => onTabPress(item.id)}>
          <Text
            style={[styles.tabText, activeTab === item.id && styles.activeTabText]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabContainer}
    />
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
  orderDateTime: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borders.radius.full,
  },
  newStatus: {
    backgroundColor: theme.colors.info.lightest,
  },
  preparingStatus: {
    backgroundColor: theme.colors.warning.lightest,
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
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  customerName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    color: theme.colors.neutral.darkest,
    marginLeft: theme.spacing[2],
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
  pickupLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[1],
  },
  pickupInfo: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.neutral.darkest,
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[1],
  },
  totalValue: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '700',
    color: theme.colors.primary.dark,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing[3],
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionButton: {
    backgroundColor: theme.colors.primary.main,
  },
  primaryActionButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
  viewButton: {
    flex: 1,
    paddingVertical: theme.spacing[3],
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  viewButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.primary.main,
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
});