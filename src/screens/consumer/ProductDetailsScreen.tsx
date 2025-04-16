import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { ConsumerStackScreenProps } from '@/navigation/types';

import { theme } from '@/styles/designSystem';

type RouteParams = {
  productId: string;
};

export default function ProductDetailsScreen() {
  const navigation = useNavigation<ConsumerStackScreenProps<'ProductDetails'>['navigation']>();
  const route = useRoute<ConsumerStackScreenProps<'ProductDetails'>['route']>();
  const { productId } = route.params;
  
  const [quantity, setQuantity] = useState(1);

  // Mock product data - in a real app, this would come from an API
  const product = {
    id: productId,
    name: 'Fresh Strawberries',
    farm: 'Green Valley Farm',
    farmId: '1',
    price: '$4.99',
    unit: 'pint',
    description: 'Sweet, juicy strawberries picked at peak ripeness. Our strawberries are grown using organic practices and are perfect for snacking, baking, or making preserves.',
    inStock: true,
    stockAmount: 24,
    organic: true,
    nutritionFacts: 'Low in calories, high in vitamin C, fiber, and antioxidants.',
    harvestDate: 'April 15, 2025',
    tags: ['Organic', 'Seasonal', 'Fruit'],
    relatedProducts: [
      { id: '2', name: 'Blueberries', price: '$5.99 / pint' },
      { id: '3', name: 'Raspberries', price: '$5.49 / pint' },
      { id: '4', name: 'Blackberries', price: '$4.99 / pint' },
    ]
  };

  const incrementQuantity = () => {
    if (quantity < product.stockAmount) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    // In a real app, this would add the product to the cart
    // For now, just navigate to the cart
    navigation.navigate('Cart');
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
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color={theme.colors.neutral.darkest} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color={theme.colors.neutral.darkest} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.productImageContainer}>
          <View style={styles.productImage} />
          {product.organic && (
            <View style={styles.organicBadge}>
              <Text style={styles.organicText}>Organic</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productInfo}>
          <TouchableOpacity 
            style={styles.farmRow}
            onPress={() => navigation.navigate('FarmProfile', { farmId: product.farmId })}
          >
            <Text style={styles.farmName}>{product.farm}</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.primary.main} />
          </TouchableOpacity>
          
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price} <Text style={styles.unit}>/ {product.unit}</Text></Text>
            <View style={styles.stockContainer}>
              <View style={[
                styles.stockIndicator, 
                { backgroundColor: product.inStock ? theme.colors.success.main : theme.colors.error.main }
              ]} />
              <Text style={styles.stockText}>
                {product.inStock ? `${product.stockAmount} in stock` : 'Out of stock'}
              </Text>
            </View>
          </View>
          
          <View style={styles.tagContainer}>
            {product.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Harvest Date:</Text>
            <Text style={styles.detailValue}>{product.harvestDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nutrition:</Text>
            <Text style={styles.detailValue}>{product.nutritionFacts}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You Might Also Like</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedProductsList}>
            {product.relatedProducts.map((relatedProduct) => (
              <TouchableOpacity 
                key={relatedProduct.id} 
                style={styles.relatedProductCard}
                onPress={() => navigation.navigate('ProductDetails', { productId: relatedProduct.id })}
              >
                <View style={styles.relatedProductImage} />
                <View style={styles.relatedProductInfo}>
                  <Text style={styles.relatedProductName}>{relatedProduct.name}</Text>
                  <Text style={styles.relatedProductPrice}>{relatedProduct.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity 
            style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
            onPress={decrementQuantity}
            disabled={quantity <= 1}
          >
            <Ionicons name="remove" size={20} color={quantity <= 1 ? theme.colors.neutral.medium : theme.colors.neutral.darkest} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity 
            style={[styles.quantityButton, quantity >= product.stockAmount && styles.quantityButtonDisabled]}
            onPress={incrementQuantity}
            disabled={quantity >= product.stockAmount}
          >
            <Ionicons name="add" size={20} color={quantity >= product.stockAmount ? theme.colors.neutral.medium : theme.colors.neutral.darkest} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={addToCart}
          disabled={!product.inStock}
        >
          <Text style={styles.addToCartButtonText}>Add to Cart - ${(parseFloat(product.price.replace('$', '')) * quantity).toFixed(2)}</Text>
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
  productImageContainer: {
    position: 'relative',
    height: 300,
  },
  productImage: {
    height: '100%',
    backgroundColor: theme.colors.neutral.light,
  },
  organicBadge: {
    position: 'absolute',
    top: theme.spacing[4],
    right: theme.spacing[4],
    backgroundColor: theme.colors.success.main,
    borderRadius: theme.borders.radius.full,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
  },
  organicText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
  productInfo: {
    padding: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  farmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  farmName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    marginRight: theme.spacing[1],
  },
  productName: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.neutral.darkest,
    marginBottom: theme.spacing[3],
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  price: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.secondary.dark,
  },
  unit: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '400',
    color: theme.colors.neutral.dark,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing[1],
  },
  stockText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
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
  detailRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing[2],
  },
  detailLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    width: '30%',
  },
  detailValue: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    flex: 1,
  },
  relatedProductsList: {
    paddingBottom: theme.spacing[2],
  },
  relatedProductCard: {
    width: 160,
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
  relatedProductImage: {
    height: 100,
    backgroundColor: theme.colors.neutral.light,
  },
  relatedProductInfo: {
    padding: theme.spacing[2],
  },
  relatedProductName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    marginBottom: theme.spacing[1],
    color: theme.colors.neutral.darkest,
  },
  relatedProductPrice: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.secondary.dark,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.light,
    backgroundColor: theme.colors.neutral.white,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    borderRadius: theme.borders.radius.md,
    marginRight: theme.spacing[3],
  },
  quantityButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
    width: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
});