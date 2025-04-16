import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/styles/designSystem';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>🌱 Green Valley Farm</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.neutral.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color={theme.colors.neutral.white} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>New Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$1,248</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>32</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="add" size={24} color={theme.colors.primary.main} />
              </View>
              <Text style={styles.actionLabel}>Add Product</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="cube-outline" size={24} color={theme.colors.primary.main} />
              </View>
              <Text style={styles.actionLabel}>Manage Inventory</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="list-outline" size={24} color={theme.colors.primary.main} />
              </View>
              <Text style={styles.actionLabel}>Process Orders</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="calendar-outline" size={24} color={theme.colors.primary.main} />
              </View>
              <Text style={styles.actionLabel}>Pickup Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#HL-12345</Text>
              <View style={styles.orderStatus}>
                <Text style={styles.orderStatusText}>New</Text>
              </View>
            </View>
            <Text style={styles.orderCustomer}>Sarah Johnson</Text>
            <View style={styles.orderDetails}>
              <Text style={styles.orderItems}>4 items</Text>
              <Text style={styles.orderTotal}>$24.25</Text>
            </View>
            <Text style={styles.orderDate}>Today, 10:23 AM</Text>
          </View>
          
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#HL-12344</Text>
              <View style={[styles.orderStatus, styles.preparingStatus]}>
                <Text style={styles.orderStatusText}>Preparing</Text>
              </View>
            </View>
            <Text style={styles.orderCustomer}>Michael Brown</Text>
            <View style={styles.orderDetails}>
              <Text style={styles.orderItems}>2 items</Text>
              <Text style={styles.orderTotal}>$15.50</Text>
            </View>
            <Text style={styles.orderDate}>Today, 9:45 AM</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Inventory Alerts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <Ionicons name="warning-outline" size={24} color={theme.colors.warning.dark} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Low Stock: Fresh Strawberries</Text>
              <Text style={styles.alertMessage}>Only 5 pints remaining in inventory</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.alertAction}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View Report</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricTitle}>Weekly Sales</Text>
              <Text style={styles.metricValue}>$1,248</Text>
            </View>
            <View style={styles.metricChart}>
              <View style={styles.chartBar} />
            </View>
            <View style={styles.metricFooter}>
              <Text style={styles.metricPeriod}>Last 7 days</Text>
              <Text style={styles.metricChange}>↑ 12% from last week</Text>
            </View>
          </View>
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
    backgroundColor: theme.colors.primary.dark,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.neutral.white,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: theme.spacing[2],
    marginLeft: theme.spacing[2],
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.primary.lightest,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing[3],
    alignItems: 'center',
    marginHorizontal: theme.spacing[1],
    shadowColor: theme.colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral.dark,
  },
  section: {
    marginTop: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  seeAllText: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: theme.colors.neutral.lightest,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing[3],
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borders.radius.md,
    backgroundColor: theme.colors.primary.lightest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[2],
  },
  actionLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.neutral.darkest,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
  },
  orderId: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  orderStatus: {
    backgroundColor: theme.colors.info.light,
    borderRadius: theme.borders.radius.sm,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  preparingStatus: {
    backgroundColor: theme.colors.warning.light,
  },
  orderStatusText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '500',
    color: theme.colors.info.dark,
  },
  orderCustomer: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[2],
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[1],
  },
  orderItems: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
  },
  orderTotal: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  orderDate: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral.dark,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.lightest,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[3],
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borders.radius.full,
    backgroundColor: theme.colors.warning.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[1],
  },
  alertMessage: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
  },
  alertAction: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.primary.main,
    marginLeft: theme.spacing[2],
  },
  metricCard: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  metricTitle: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  metricValue: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '700',
    color: theme.colors.primary.dark,
  },
  metricChart: {
    height: 40,
    backgroundColor: theme.colors.neutral.lightest,
    borderRadius: theme.borders.radius.sm,
    marginBottom: theme.spacing[3],
    overflow: 'hidden',
  },
  chartBar: {
    height: '100%',
    width: '75%',
    backgroundColor: theme.colors.primary.light,
  },
  metricFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricPeriod: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral.dark,
  },
  metricChange: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.success.main,
  },
});