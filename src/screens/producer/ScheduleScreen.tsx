import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { ProducerTabScreenProps } from '@/navigation/types';
import { theme } from '@/styles/designSystem';

// Mock schedule data - pickup time slots
const mockTimeSlots = [
  {
    id: '1',
    day: 'Monday',
    isActive: true,
    slots: [
      { id: '1-1', time: '10:00 AM - 12:00 PM', isActive: true },
      { id: '1-2', time: '2:00 PM - 4:00 PM', isActive: true },
    ],
  },
  {
    id: '2',
    day: 'Tuesday',
    isActive: true,
    slots: [
      { id: '2-1', time: '10:00 AM - 12:00 PM', isActive: true },
      { id: '2-2', time: '2:00 PM - 4:00 PM', isActive: true },
    ],
  },
  {
    id: '3',
    day: 'Wednesday',
    isActive: true,
    slots: [
      { id: '3-1', time: '10:00 AM - 12:00 PM', isActive: true },
      { id: '3-2', time: '2:00 PM - 4:00 PM', isActive: true },
    ],
  },
  {
    id: '4',
    day: 'Thursday',
    isActive: true,
    slots: [
      { id: '4-1', time: '10:00 AM - 12:00 PM', isActive: true },
      { id: '4-2', time: '2:00 PM - 4:00 PM', isActive: true },
    ],
  },
  {
    id: '5',
    day: 'Friday',
    isActive: true,
    slots: [
      { id: '5-1', time: '10:00 AM - 12:00 PM', isActive: true },
      { id: '5-2', time: '2:00 PM - 4:00 PM', isActive: true },
    ],
  },
  {
    id: '6',
    day: 'Saturday',
    isActive: true,
    slots: [
      { id: '6-1', time: '9:00 AM - 1:00 PM', isActive: true },
    ],
  },
  {
    id: '7',
    day: 'Sunday',
    isActive: false,
    slots: [],
  },
];

// Mock upcoming pickups
const mockPickups = [
  {
    id: '1',
    orderNumber: 'HL-12345',
    customerName: 'Sarah Johnson',
    date: 'May 17, 2023',
    time: '2:00 PM - 4:00 PM',
    items: [
      { name: 'Fresh Strawberries', quantity: 2 },
      { name: 'Organic Spinach', quantity: 1 },
      { name: 'Heirloom Tomatoes', quantity: 2 },
    ],
  },
  {
    id: '2',
    orderNumber: 'HL-12346',
    customerName: 'Michael Brown',
    date: 'May 17, 2023',
    time: '10:00 AM - 12:00 PM',
    items: [
      { name: 'Fresh Strawberries', quantity: 1 },
      { name: 'Blueberries', quantity: 2 },
    ],
  },
  {
    id: '3',
    orderNumber: 'HL-12347',
    customerName: 'Emily Davis',
    date: 'May 16, 2023',
    time: '4:00 PM - 6:00 PM',
    items: [
      { name: 'Organic Spinach', quantity: 2 },
      { name: 'Heirloom Tomatoes', quantity: 1 },
      { name: 'Fresh Herbs', quantity: 1 },
    ],
  },
];

// Tab options
const tabOptions = [
  { id: 'pickups', label: 'Upcoming Pickups' },
  { id: 'schedule', label: 'Pickup Schedule' },
];

export default function ScheduleScreen() {
  const navigation = useNavigation<ProducerTabScreenProps<'Schedule'>['navigation']>();
  const [activeTab, setActiveTab] = useState('pickups');
  const [timeSlots, setTimeSlots] = useState(mockTimeSlots);
  
  const toggleDayActive = (dayId: string) => {
    setTimeSlots(
      timeSlots.map(day => {
        if (day.id === dayId) {
          return { ...day, isActive: !day.isActive };
        }
        return day;
      })
    );
  };
  
  const toggleSlotActive = (dayId: string, slotId: string) => {
    setTimeSlots(
      timeSlots.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            slots: day.slots.map(slot => {
              if (slot.id === slotId) {
                return { ...slot, isActive: !slot.isActive };
              }
              return slot;
            }),
          };
        }
        return day;
      })
    );
  };
  
  const renderPickupItem = ({ item }: { item: typeof mockPickups[0] }) => (
    <View style={styles.pickupCard}>
      <View style={styles.pickupHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}>
          <Text style={styles.viewButtonText}>View Order</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.customerInfo}>
        <Ionicons name="person-outline" size={16} color={theme.colors.neutral.dark} />
        <Text style={styles.customerName}>{item.customerName}</Text>
      </View>
      
      <View style={styles.pickupTimeContainer}>
        <View style={styles.pickupTimeIconContainer}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.primary.main} />
        </View>
        <Text style={styles.pickupTimeText}>{item.date}</Text>
        <View style={styles.pickupTimeIconContainer}>
          <Ionicons name="time-outline" size={16} color={theme.colors.primary.main} />
        </View>
        <Text style={styles.pickupTimeText}>{item.time}</Text>
      </View>
      
      <View style={styles.itemsContainer}>
        <Text style={styles.itemsLabel}>Items:</Text>
        {item.items.map((orderItem, index) => (
          <Text key={index} style={styles.itemText}>
            • {orderItem.quantity}x {orderItem.name}
          </Text>
        ))}
      </View>
    </View>
  );
  
  const renderDayItem = ({ item }: { item: typeof mockTimeSlots[0] }) => (
    <View style={styles.dayCard}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayName}>{item.day}</Text>
        <TouchableOpacity
          style={[styles.toggleButton, item.isActive ? styles.activeToggle : styles.inactiveToggle]}
          onPress={() => toggleDayActive(item.id)}>
          <Text style={[styles.toggleText, item.isActive ? styles.activeToggleText : styles.inactiveToggleText]}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {item.isActive ? (
        <>
          <Text style={styles.timeSlotsLabel}>Pickup Time Slots:</Text>
          {item.slots.map(slot => (
            <View key={slot.id} style={styles.timeSlotRow}>
              <Text style={styles.timeSlotText}>{slot.time}</Text>
              <TouchableOpacity
                style={[
                  styles.slotToggleButton,
                  slot.isActive ? styles.activeSlotToggle : styles.inactiveSlotToggle,
                ]}
                onPress={() => toggleSlotActive(item.id, slot.id)}>
                <Text
                  style={[
                    styles.slotToggleText,
                    slot.isActive ? styles.activeSlotToggleText : styles.inactiveSlotToggleText,
                  ]}>
                  {slot.isActive ? 'Available' : 'Unavailable'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          
          <TouchableOpacity style={styles.addSlotButton}>
            <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary.main} />
            <Text style={styles.addSlotText}>Add Time Slot</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.closedText}>Closed on {item.day}s</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => navigation.navigate('PickupSchedule')}>
          <Ionicons name="calendar" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
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
      
      {activeTab === 'pickups' ? (
        mockPickups.length > 0 ? (
          <FlatList
            data={mockPickups}
            renderItem={renderPickupItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.pickupsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="calendar-outline" size={64} color={theme.colors.neutral.light} />
            </View>
            <Text style={styles.emptyTitle}>No upcoming pickups</Text>
            <Text style={styles.emptyText}>
              You don't have any scheduled pickups for the next few days.
            </Text>
          </View>
        )
      ) : (
        <FlatList
          data={timeSlots}
          renderItem={renderDayItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.daysList}
          showsVerticalScrollIndicator={false}
        />
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
  calendarButton: {
    padding: theme.spacing[2],
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[6],
    marginBottom: theme.spacing[4],
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.neutral.light,
  },
  activeTab: {
    borderBottomColor: theme.colors.primary.main,
  },
  tabText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    color: theme.colors.neutral.dark,
  },
  activeTabText: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  pickupsList: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[6],
  },
  pickupCard: {
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
  pickupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  orderNumber: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  viewButton: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  viewButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '500',
    color: theme.colors.primary.main,
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
  pickupTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
    flexWrap: 'wrap',
  },
  pickupTimeIconContainer: {
    marginRight: theme.spacing[1],
  },
  pickupTimeText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
    marginRight: theme.spacing[3],
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.light,
    paddingTop: theme.spacing[3],
  },
  itemsLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[2],
  },
  itemText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[1],
  },
  daysList: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[6],
  },
  dayCard: {
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
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  dayName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  toggleButton: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borders.radius.full,
  },
  activeToggle: {
    backgroundColor: theme.colors.success.lightest,
  },
  inactiveToggle: {
    backgroundColor: theme.colors.neutral.lightest,
  },
  toggleText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '500',
  },
  activeToggleText: {
    color: theme.colors.success.dark,
  },
  inactiveToggleText: {
    color: theme.colors.neutral.dark,
  },
  timeSlotsLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[3],
  },
  timeSlotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  timeSlotText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
  },
  slotToggleButton: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borders.radius.full,
  },
  activeSlotToggle: {
    backgroundColor: theme.colors.success.lightest,
  },
  inactiveSlotToggle: {
    backgroundColor: theme.colors.error.lightest,
  },
  slotToggleText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '500',
  },
  activeSlotToggleText: {
    color: theme.colors.success.dark,
  },
  inactiveSlotToggleText: {
    color: theme.colors.error.dark,
  },
  addSlotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing[2],
  },
  addSlotText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    marginLeft: theme.spacing[1],
  },
  closedText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    fontStyle: 'italic',
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