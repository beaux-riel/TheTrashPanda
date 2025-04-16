import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { ConsumerTabScreenProps } from '@/navigation/types';
import { theme } from '@/styles/designSystem';

// Mock data for categories
const categories = [
  { id: '1', name: 'Vegetables', icon: 'leaf-outline' },
  { id: '2', name: 'Fruits', icon: 'nutrition-outline' },
  { id: '3', name: 'Dairy', icon: 'water-outline' },
  { id: '4', name: 'Eggs', icon: 'egg-outline' },
  { id: '5', name: 'Meat', icon: 'restaurant-outline' },
  { id: '6', name: 'Honey', icon: 'flower-outline' },
  { id: '7', name: 'Herbs', icon: 'medical-outline' },
  { id: '8', name: 'Baked Goods', icon: 'pizza-outline' },
];

// Mock data for farms
const farms = [
  {
    id: '1',
    name: 'Green Valley Farm',
    distance: '3.2 miles away',
    rating: 4.8,
    reviewCount: 124,
    tags: ['Organic', 'Vegetables', 'Fruits'],
  },
  {
    id: '2',
    name: 'Sunny Acres',
    distance: '5.7 miles away',
    rating: 4.6,
    reviewCount: 89,
    tags: ['Free-Range', 'Eggs', 'Poultry'],
  },
  {
    id: '3',
    name: 'Hillside Dairy',
    distance: '7.1 miles away',
    rating: 4.9,
    reviewCount: 156,
    tags: ['Dairy', 'Cheese', 'Organic'],
  },
  {
    id: '4',
    name: 'Red Barn Orchards',
    distance: '8.5 miles away',
    rating: 4.7,
    reviewCount: 112,
    tags: ['Fruits', 'Berries', 'Jams'],
  },
];

export default function ExploreScreen() {
  const navigation = useNavigation<ConsumerTabScreenProps<'Explore'>['navigation']>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategoryItem,
      ]}
      onPress={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}>
      <View
        style={[
          styles.categoryIcon,
          selectedCategory === item.id && styles.selectedCategoryIcon,
        ]}>
        <Ionicons
          name={item.icon as any}
          size={24}
          color={
            selectedCategory === item.id
              ? theme.colors.neutral.white
              : theme.colors.primary.main
          }
        />
      </View>
      <Text
        style={[
          styles.categoryName,
          selectedCategory === item.id && styles.selectedCategoryName,
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFarmItem = ({ item }: { item: typeof farms[0] }) => (
    <TouchableOpacity
      style={styles.farmCard}
      onPress={() => navigation.navigate('FarmProfile', { farmId: item.id })}>
      <View style={styles.farmImage} />
      <View style={styles.farmContent}>
        <View style={styles.farmHeader}>
          <Text style={styles.farmName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={theme.colors.warning.main} />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount})</Text>
          </View>
        </View>
        <Text style={styles.farmDistance}>{item.distance}</Text>
        <View style={styles.tagContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color={theme.colors.neutral.darkest} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.neutral.medium} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search farms or products..."
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
      
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <View style={styles.farmsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Farms Near You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={farms}
          renderItem={renderFarmItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.farmsList}
        />
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
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.neutral.darkest,
  },
  filterButton: {
    padding: theme.spacing[2],
  },
  searchContainer: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[4],
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
  categoriesContainer: {
    paddingHorizontal: theme.spacing[6],
    marginBottom: theme.spacing[4],
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[3],
  },
  categoriesList: {
    paddingRight: theme.spacing[6],
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: theme.spacing[4],
  },
  selectedCategoryItem: {
    opacity: 1,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: theme.borders.radius.full,
    backgroundColor: theme.colors.primary.lightest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[2],
  },
  selectedCategoryIcon: {
    backgroundColor: theme.colors.primary.main,
  },
  categoryName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
  },
  selectedCategoryName: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  farmsContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  seeAllText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    fontWeight: '500',
  },
  farmsList: {
    paddingBottom: theme.spacing[6],
  },
  farmCard: {
    flexDirection: 'row',
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
  farmImage: {
    width: 100,
    height: 100,
    backgroundColor: theme.colors.neutral.light,
  },
  farmContent: {
    flex: 1,
    padding: theme.spacing[3],
  },
  farmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[1],
  },
  farmName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    marginLeft: theme.spacing[1],
  },
  reviewCount: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral.medium,
    marginLeft: theme.spacing[1],
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
});