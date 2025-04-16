import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { ConsumerStackScreenProps } from '@/navigation/types';

import { theme } from '@/styles/designSystem';

type RouteParams = {
  farmId: string;
};

export default function FarmProfileScreen() {
  const navigation = useNavigation<ConsumerStackScreenProps<'FarmProfile'>['navigation']>();
  const route = useRoute<ConsumerStackScreenProps<'FarmProfile'>['route']>();
  const { farmId } = route.params;

  // Mock farm data - in a real app, this would come from an API
  const farm = {
    id: farmId,
    name: 'Green Valley Farm',
    description: 'A family-owned organic farm specializing in seasonal vegetables, fruits, and free-range eggs. We use sustainable farming practices and are committed to providing the freshest produce to our community.',
    distance: '3.2 miles away',
    rating: 4.8,
    reviewCount: 124,
    tags: ['Organic', 'Vegetables', 'Fruits', 'Eggs'],
    address: '1234 Farm Road, Greenville, CA 95667',
    hours: 'Mon-Sat: 8am-5pm, Sun: 9am-3pm',
    phone: '(555) 123-4567',
    email: 'info@greenvalleyfarm.com',
    website: 'www.greenvalleyfarm.com',
    products: [
      { id: '1', name: 'Fresh Strawberries', price: '$4.99 / pint' },
      { id: '2', name: 'Heirloom Tomatoes', price: '$3.99 / lb' },
      { id: '3', name: 'Organic Kale', price: '$2.99 / bunch' },
      { id: '4', name: 'Free-Range Eggs', price: '$5.50 / dozen' },
      { id: '5', name: 'Honey', price: '$8.99 / jar' },
      { id: '6', name: 'Apple Cider', price: '$6.99 / bottle' },
    ]
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.neutral.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color={theme.colors.neutral.white} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.farmImageContainer}>
          <View style={styles.farmImage} />
          <View style={styles.farmOverlay}>
            <Text style={styles.farmName}>{farm.name}</Text>
            <View style={styles.farmMeta}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={theme.colors.accent.main} />
                <Text style={styles.ratingText}>{farm.rating} ({farm.reviewCount} reviews)</Text>
              </View>
              <Text style={styles.distanceText}>{farm.distance}</Text>
            </View>
            <View style={styles.tagContainer}>
              {farm.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.descriptionText}>{farm.description}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Hours</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={theme.colors.neutral.dark} />
            <Text style={styles.infoText}>{farm.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={theme.colors.neutral.dark} />
            <Text style={styles.infoText}>{farm.hours}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={theme.colors.neutral.dark} />
            <Text style={styles.infoText}>{farm.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.neutral.dark} />
            <Text style={styles.infoText}>{farm.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="globe-outline" size={20} color={theme.colors.neutral.dark} />
            <Text style={styles.infoText}>{farm.website}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Products</Text>
          <View style={styles.productGrid}>
            {farm.products.map((product) => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
              >
                <View style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => {/* Handle contact */}}
        >
          <Text style={styles.contactButtonText}>Contact Farm</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.orderButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.orderButtonText}>Order Products</Text>
        </TouchableOpacity>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  farmImageContainer: {
    position: 'relative',
    height: 250,
  },
  farmImage: {
    height: '100%',
    backgroundColor: theme.colors.primary.light,
  },
  farmOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing[4],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  farmName: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.neutral.white,
    marginBottom: theme.spacing[2],
  },
  farmMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing[4],
  },
  ratingText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.white,
    marginLeft: theme.spacing[1],
  },
  distanceText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.white,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.sm,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    marginRight: theme.spacing[2],
    marginBottom: theme.spacing[1],
  },
  tagText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral.white,
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
  descriptionText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    lineHeight: 24,
    color: theme.colors.neutral.dark,
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
    flex: 1,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  footer: {
    flexDirection: 'row',
    padding: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.light,
    backgroundColor: theme.colors.neutral.white,
  },
  contactButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing[3],
    alignItems: 'center',
    marginRight: theme.spacing[2],
  },
  contactButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
  orderButton: {
    flex: 1,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing[3],
    alignItems: 'center',
    marginLeft: theme.spacing[2],
  },
  orderButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
});