import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { ProducerTabScreenProps } from '@/navigation/types';
import { theme } from '@/styles/designSystem';

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Fresh Strawberries',
    category: 'Fruits',
    price: 4.99,
    unit: 'pint',
    stock: 25,
    isActive: true,
  },
  {
    id: '2',
    name: 'Organic Spinach',
    category: 'Vegetables',
    price: 3.49,
    unit: 'bunch',
    stock: 15,
    isActive: true,
  },
  {
    id: '3',
    name: 'Heirloom Tomatoes',
    category: 'Vegetables',
    price: 5.99,
    unit: 'lb',
    stock: 30,
    isActive: true,
  },
  {
    id: '4',
    name: 'Free-Range Eggs',
    category: 'Dairy & Eggs',
    price: 5.50,
    unit: 'dozen',
    stock: 20,
    isActive: true,
  },
  {
    id: '5',
    name: 'Honey',
    category: 'Other',
    price: 8.99,
    unit: 'jar',
    stock: 10,
    isActive: true,
  },
  {
    id: '6',
    name: 'Blueberries',
    category: 'Fruits',
    price: 6.99,
    unit: 'pint',
    stock: 0,
    isActive: false,
  },
];

// Tab options for filtering products
const tabOptions = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
  { id: 'low', label: 'Low Stock' },
];

export default function ProductsScreen() {
  const navigation = useNavigation<ProducerTabScreenProps<'Products'>['navigation']>();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter products based on active tab and search query
  const filteredProducts = mockProducts.filter(product => {
    // Filter by tab
    if (activeTab === 'active' && !product.isActive) return false;
    if (activeTab === 'inactive' && product.isActive) return false;
    if (activeTab === 'low' && product.stock > 10) return false;
    
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const renderProductItem = ({ item }: { item: typeof mockProducts[0] }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('EditProduct', { productId: item.id })}>
      <View style={styles.productImageContainer}>
        <View style={styles.productImage} />
        {!item.isActive && (
          <View style={styles.inactiveOverlay}>
            <Text style={styles.inactiveText}>Inactive</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>
          ${item.price.toFixed(2)} / {item.unit}
        </Text>
        
        <View style={styles.stockContainer}>
          <Text style={[
            styles.stockText,
            item.stock === 0 ? styles.outOfStockText : (item.stock <= 10 ? styles.lowStockText : {}),
          ]}>
            {item.stock === 0 ? 'Out of Stock' : `${item.stock} in stock`}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProduct', { productId: item.id })}>
        <Ionicons name="create-outline" size={20} color={theme.colors.primary.main} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}>
          <Ionicons name="add" size={24} color={theme.colors.neutral.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.neutral.medium} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={theme.colors.neutral.medium}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.neutral.medium} />
            </TouchableOpacity>
          ) : null}
        </View>
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
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mockProducts.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {mockProducts.filter(p => p.isActive).length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {mockProducts.filter(p => p.stock <= 10 && p.stock > 0).length}
          </Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {mockProducts.filter(p => p.stock === 0).length}
          </Text>
          <Text style={styles.statLabel}>Out of Stock</Text>
        </View>
      </View>
      
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cube-outline" size={64} color={theme.colors.neutral.light} />
          </View>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptyText}>
            {searchQuery
              ? `No products match "${searchQuery}"`
              : `You don't have any ${activeTab !== 'all' ? activeTab : ''} products yet.`}
          </Text>
          <TouchableOpacity
            style={styles.addProductButton}
            onPress={() => navigation.navigate('AddProduct')}>
            <Text style={styles.addProductButtonText}>Add New Product</Text>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borders.radius.full,
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: theme.spacing[6],
    marginBottom: theme.spacing[4],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.lightest,
    borderRadius: theme.borders.radius.full,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing[2],
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[6],
    marginBottom: theme.spacing[4],
  },
  tab: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
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
  productsList: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[6],
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borders.radius.lg,
    marginBottom: theme.spacing[4],
    padding: theme.spacing[3],
    shadowColor: theme.colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImageContainer: {
    position: 'relative',
    marginRight: theme.spacing[3],
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borders.radius.md,
    backgroundColor: theme.colors.neutral.light,
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
    color: theme.colors.neutral.white,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    backgroundColor: theme.colors.error.main,
    borderRadius: theme.borders.radius.sm,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[1],
  },
  productCategory: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[1],
  },
  productPrice: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing[2],
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.success.dark,
  },
  lowStockText: {
    color: theme.colors.warning.dark,
  },
  outOfStockText: {
    color: theme.colors.error.main,
  },
  editButton: {
    padding: theme.spacing[2],
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
  addProductButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addProductButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
});