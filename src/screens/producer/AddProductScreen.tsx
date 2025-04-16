import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Switch, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { ProducerStackScreenProps } from '@/navigation/types';

import { theme } from '@/styles/designSystem';

export default function AddProductScreen() {
  const navigation = useNavigation<ProducerStackScreenProps<'AddProduct'>['navigation']>();
  
  // Form state
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    price: '',
    unit: 'lb',
    description: '',
    stockAmount: '',
    isOrganic: false,
    isAvailable: true,
    harvestDate: '',
    nutritionFacts: '',
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Available categories
  const categories = [
    'Vegetables', 'Fruits', 'Dairy', 'Eggs', 'Meat', 'Poultry', 
    'Herbs', 'Honey', 'Preserves', 'Baked Goods', 'Beverages'
  ];
  
  // Available units
  const units = ['lb', 'oz', 'each', 'bunch', 'pint', 'quart', 'gallon', 'dozen'];

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const addImage = () => {
    // In a real app, this would open the camera or image picker
    // For now, just add a placeholder
    setImages([...images, 'placeholder']);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setProductData({
      ...productData,
      [field]: value,
    });
  };

  const saveProduct = () => {
    // In a real app, this would save the product to the backend
    // For now, just navigate back to the products screen
    navigation.navigate('ProducerTabs', { screen: 'Products' });
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
        <Text style={styles.headerTitle}>Add New Product</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveProduct}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Images</Text>
          <View style={styles.imagesContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <View style={styles.image} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color={theme.colors.error.main} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity 
              style={styles.addImageButton}
              onPress={addImage}
            >
              <Ionicons name="add" size={40} color={theme.colors.neutral.medium} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Text style={styles.inputLabel}>Product Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            placeholderTextColor={theme.colors.neutral.medium}
            value={productData.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
          
          <Text style={styles.inputLabel}>Categories*</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategories.includes(category) && styles.categoryChipSelected
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text 
                  style={[
                    styles.categoryChipText,
                    selectedCategories.includes(category) && styles.categoryChipTextSelected
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.priceContainer}>
            <View style={styles.priceInputContainer}>
              <Text style={styles.inputLabel}>Price*</Text>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.neutral.medium}
                  keyboardType="decimal-pad"
                  value={productData.price}
                  onChangeText={(text) => handleInputChange('price', text)}
                />
              </View>
            </View>
            
            <View style={styles.unitInputContainer}>
              <Text style={styles.inputLabel}>Unit*</Text>
              <View style={styles.unitPickerContainer}>
                {units.map((unit) => (
                  <TouchableOpacity 
                    key={unit}
                    style={[
                      styles.unitChip,
                      productData.unit === unit && styles.unitChipSelected
                    ]}
                    onPress={() => handleInputChange('unit', unit)}
                  >
                    <Text 
                      style={[
                        styles.unitChipText,
                        productData.unit === unit && styles.unitChipTextSelected
                      ]}
                    >
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          
          <Text style={styles.inputLabel}>Description*</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your product..."
            placeholderTextColor={theme.colors.neutral.medium}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={productData.description}
            onChangeText={(text) => handleInputChange('description', text)}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory</Text>
          
          <Text style={styles.inputLabel}>Stock Amount*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter quantity available"
            placeholderTextColor={theme.colors.neutral.medium}
            keyboardType="number-pad"
            value={productData.stockAmount}
            onChangeText={(text) => handleInputChange('stockAmount', text)}
          />
          
          <View style={styles.switchContainer}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Organic Product</Text>
              <Switch
                value={productData.isOrganic}
                onValueChange={(value) => handleInputChange('isOrganic', value)}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={productData.isOrganic ? theme.colors.primary.main : theme.colors.neutral.white}
              />
            </View>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Available for Purchase</Text>
              <Switch
                value={productData.isAvailable}
                onValueChange={(value) => handleInputChange('isAvailable', value)}
                trackColor={{ false: theme.colors.neutral.light, true: theme.colors.primary.light }}
                thumbColor={productData.isAvailable ? theme.colors.primary.main : theme.colors.neutral.white}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Details</Text>
          
          <Text style={styles.inputLabel}>Harvest Date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={theme.colors.neutral.medium}
            value={productData.harvestDate}
            onChangeText={(text) => handleInputChange('harvestDate', text)}
          />
          
          <Text style={styles.inputLabel}>Nutrition Facts</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter nutrition information..."
            placeholderTextColor={theme.colors.neutral.medium}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={productData.nutritionFacts}
            onChangeText={(text) => handleInputChange('nutritionFacts', text)}
          />
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.saveProductButton}
          onPress={saveProduct}
        >
          <Text style={styles.saveProductButtonText}>Save Product</Text>
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
  headerTitle: {
    fontFamily: theme.typography.fontFamily.secondary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.neutral.darkest,
  },
  saveButton: {
    padding: theme.spacing[2],
  },
  saveButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
  scrollView: {
    flex: 1,
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
    marginBottom: theme.spacing[4],
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: theme.borders.radius.md,
    marginRight: theme.spacing[3],
    marginBottom: theme.spacing[3],
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.neutral.light,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: theme.colors.neutral.white,
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },
  inputLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing[2],
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing[3],
    marginBottom: theme.spacing[3],
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing[3],
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    borderRadius: theme.borders.radius.full,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    marginRight: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  categoryChipText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.dark,
  },
  categoryChipTextSelected: {
    color: theme.colors.neutral.white,
  },
  priceContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing[3],
  },
  priceInputContainer: {
    flex: 1,
    marginRight: theme.spacing[3],
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing[3],
  },
  currencySymbol: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.dark,
    marginRight: theme.spacing[1],
  },
  priceInput: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
  },
  unitInputContainer: {
    flex: 1,
  },
  unitPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  unitChip: {
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    borderRadius: theme.borders.radius.full,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    marginRight: theme.spacing[1],
    marginBottom: theme.spacing[1],
  },
  unitChipSelected: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  unitChipText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral.dark,
  },
  unitChipTextSelected: {
    color: theme.colors.neutral.white,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    marginBottom: theme.spacing[3],
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
  },
  switchContainer: {
    marginTop: theme.spacing[2],
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  switchLabel: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkest,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.light,
    backgroundColor: theme.colors.neutral.white,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 1,
    borderColor: theme.colors.neutral.medium,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing[3],
    alignItems: 'center',
    marginRight: theme.spacing[2],
  },
  cancelButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.dark,
  },
  saveProductButton: {
    flex: 2,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing[3],
    alignItems: 'center',
    marginLeft: theme.spacing[2],
  },
  saveProductButtonText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
});