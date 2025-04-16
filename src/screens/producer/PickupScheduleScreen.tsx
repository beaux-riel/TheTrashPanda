import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { ProducerStackScreenProps } from '@/navigation/types';

import { theme } from '@/styles/designSystem';

// Mock data for pickup schedule
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Generate dates for the next 7 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    dates.push({
      id: i.toString(),
      date: date.getDate(),
      day: DAYS[date.getDay()],
      month: MONTHS[date.getMonth()],
      year: date.getFullYear(),
      fullDate: date,
    });
  }
  
  return dates;
};

// Mock pickup data
const generatePickups = (date: Date) => {
  // Generate 0-5 random pickups for the given date
  const count = Math.floor(Math.random() * 6);
  const pickups = [];
  
  for (let i = 0; i < count; i++) {
    const hour = 8 + Math.floor(Math.random() * 10); // 8 AM to 5 PM
    const minute = Math.random() > 0.5 ? 0 : 30;
    
    pickups.push({
      id: `${date.toDateString()}-${i}`,
      orderId: `ORD-${1000 + Math.floor(Math.random() * 9000)}`,
      customerName: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'][Math.floor(Math.random() * 5)],
      time: `${hour}:${minute === 0 ? '00' : '30'} ${hour >= 12 ? 'PM' : 'AM'}`,
      items: Math.floor(Math.random() * 10) + 1,
      status: ['Confirmed', 'Ready', 'Completed'][Math.floor(Math.random() * 3)],
    });
  }
  
  // Sort by time
  return pickups.sort((a, b) => {
    const timeA = a.time;
    const timeB = b.time;
    return timeA.localeCompare(timeB);
  });
};

export default function PickupScheduleScreen() {
  const navigation = useNavigation<ProducerStackScreenProps<'PickupSchedule'>['navigation']>();
  const dates = generateDates();
  
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [pickups, setPickups] = useState(generatePickups(selectedDate.fullDate));

  const handleDateSelect = (date: typeof selectedDate) => {
    setSelectedDate(date);
    setPickups(generatePickups(date.fullDate));
  };

  const renderDateItem = ({ item }: { item: typeof selectedDate }) => (
    <TouchableOpacity
      style={[
        styles.dateItem,
        selectedDate.id === item.id && styles.dateItemSelected,
      ]}
      onPress={() => handleDateSelect(item)}
    >
      <Text style={[styles.dateDay, selectedDate.id === item.id && styles.dateTextSelected]}>
        {item.day.substring(0, 3)}
      </Text>
      <Text style={[styles.dateNumber, selectedDate.id === item.id && styles.dateTextSelected]}>
        {item.date}
      </Text>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Pickup Schedule</Text>
        <TouchableOpacity 
          style={styles.calendarButton}
          onPress={() => {/* Open calendar */}}
        >
          <Ionicons name="calendar-outline" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.dateSelector}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dates}
          renderItem={renderDateItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.dateList}
        />
      </View>
      
      <View style={styles.selectedDateHeader}>
        <Text style={styles.selectedDateText}>
          {selectedDate.day}, {selectedDate.month} {selectedDate.date}, {selectedDate.year}
        </Text>
        <View style={styles.pickupCount}>
          <Text style={styles.pickupCountText}>{pickups.length} Pickups</Text>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {pickups.length > 0 ? (
          pickups.map((pickup) => (
            <TouchableOpacity 
              key={pickup.id} 
              style={styles.pickupCard}
              onPress={() => navigation.navigate('OrderDetails', { orderId: pickup.orderId })}
            >
              <View style={styles.pickupTimeContainer}>
                <Text style={styles.pickupTime}>{pickup.time}</Text>
              </View>
              <View style={styles.pickupDetails}>
                <Text style={styles.pickupOrderId}>{pickup.orderId}</Text>
                <Text style={styles.pickupCustomerName}>{pickup.customerName}</Text>
                <View style={styles.pickupItemsRow}>
                  <Text style={styles.pickupItemsCount}>{pickup.items} items</Text>
                  <View style={[styles.statusBadge, getStatusStyle(pickup.status)]}>
                    <Text style={styles.statusText}>{pickup.status}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral.medium} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color={theme.colors.neutral.light} />
            <Text style={styles.emptyStateTitle}>No Pickups Scheduled</Text>
            <Text style={styles.emptyStateText}>There are no pickups scheduled for this date.</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {/* Handle add pickup */}}
        >
          <Ionicons name="add" size={24} color={theme.colors.neutral.white} />
          <Text style={styles.addButtonText}>Add Pickup Slot</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Helper function to get status badge styles
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return styles.statusConfirmed;
    case 'Ready':
      return styles.statusReady;
    case 'Completed':
      return styles.statusCompleted;
    default:
      return styles.statusConfirmed;
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
  calendarButton: {
    padding: theme.spacing[2],
  },
  dateSelector: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  dateList: {
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 70,
    borderRadius: theme.borders.radius.md,
    marginRight: theme.spacing[2],
    backgroundColor: theme.colors.neutral.lightest,
  },
  dateItemSelected: {
    backgroundColor: theme.colors.primary.main,
  },
  dateDay: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[1],
  },
  dateNumber: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  dateTextSelected: {
    color: theme.colors.neutral.white,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.neutral.lightest,
  },
  selectedDateText: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  pickupCount: {
    backgroundColor: theme.colors.primary.lightest,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borders.radius.full,
  },
  pickupCountText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.dark,
  },
  scrollView: {
    flex: 1,
    padding: theme.spacing[4],
  },
  pickupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[3],
    shadowColor: theme.colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pickupTimeContainer: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupTime: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.primary.dark,
  },
  pickupDetails: {
    flex: 1,
    marginLeft: theme.spacing[3],
  },
  pickupOrderId: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[1],
  },
  pickupCustomerName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[1],
  },
  pickupItemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupItemsCount: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
    marginRight: theme.spacing[2],
  },
  statusBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borders.radius.full,
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
  statusText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[10],
  },
  emptyStateTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },
  emptyStateText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    textAlign: 'center',
    paddingHorizontal: theme.spacing[6],
  },
  footer: {
    padding: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.light,
    backgroundColor: theme.colors.neutral.white,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
    marginLeft: theme.spacing[2],
  },
});