import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/styles/designSystem';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>🌱 HarvestLink</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.neutral.darkest} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="cart-outline" size={24} color={theme.colors.neutral.darkest} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchBar}>
            <Ionicons name="search" size={20} color={theme.colors.neutral.medium} />
            <Text style={styles.searchText}>Search farms or products...</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Farms</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.farmList}>
            {/* Placeholder for farm cards */}
            <View style={styles.farmCard}>
              <View style={styles.farmImage} />
              <View style={styles.farmInfo}>
                <Text style={styles.farmName}>Green Valley Farm</Text>
                <Text style={styles.farmDistance}>3.2 miles away</Text>
                <View style={styles.tagContainer}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Organic</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Vegetables</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.farmCard}>
              <View style={styles.farmImage} />
              <View style={styles.farmInfo}>
                <Text style={styles.farmName}>Sunny Acres</Text>
                <Text style={styles.farmDistance}>5.7 miles away</Text>
                <View style={styles.tagContainer}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Free-Range</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Eggs</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Seasonal Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.productGrid}>
            {/* Placeholder for product cards */}
            <View style={styles.productCard}>
              <View style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productFarm}>Green Valley Farm</Text>
                <Text style={styles.productName}>Fresh Strawberries</Text>
                <Text style={styles.productPrice}>$4.99 / pint</Text>
              </View>
            </View>
            
            <View style={styles.productCard}>
              <View style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productFarm}>Sunny Acres</Text>
                <Text style={styles.productName}>Free-Range Eggs</Text>
                <Text style={styles.productPrice}>$5.50 / dozen</Text>
              </View>
            </View>
            
            <View style={styles.productCard}>
              <View style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productFarm}>Green Valley Farm</Text>
                <Text style={styles.productName}>Heirloom Tomatoes</Text>
                <Text style={styles.productPrice}>$3.99 / lb</Text>
              </View>
            </View>
            
            <View style={styles.productCard}>
              <View style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productFarm}>Hillside Dairy</Text>
                <Text style={styles.productName}>Artisan Cheese</Text>
                <Text style={styles.productPrice}>$7.50 / 8 oz</Text>
              </View>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.primary.dark,
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
  searchContainer: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.primary.lightest,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borders.radius.full,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    shadowColor: theme.colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchText: {
    marginLeft: theme.spacing[2],
    color: theme.colors.neutral.medium,
    fontSize: theme.typography.fontSize.md,
  },
  section: {
    marginTop: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  seeAllText: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
  },
  farmList: {
    paddingBottom: theme.spacing[4],
  },
  farmCard: {
    width: 240,
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borders.radius.lg,
    marginRight: theme.spacing[4],
    shadowColor: theme.colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  farmImage: {
    height: 120,
    backgroundColor: theme.colors.neutral.light,
  },
  farmInfo: {
    padding: theme.spacing[3],
  },
  farmName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    marginBottom: theme.spacing[1],
    color: theme.colors.neutral.darkest,
  },
  farmDistance: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[2],
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: theme.colors.primary.lightest,
    borderRadius: theme.borders.radius.sm,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    marginRight: theme.spacing[2],
    marginBottom: theme.spacing[1],
  },
  tagText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.dark,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[6],
  },
  productCard: {
    width: '48%',
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borders.radius.lg,
    marginBottom: theme.spacing[4],
    shadowColor: theme.colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  productImage: {
    height: 120,
    backgroundColor: theme.colors.neutral.light,
  },
  productInfo: {
    padding: theme.spacing[3],
  },
  productFarm: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing[1],
  },
  productName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    marginBottom: theme.spacing[1],
    color: theme.colors.neutral.darkest,
  },
  productPrice: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.secondary.dark,
  },
});