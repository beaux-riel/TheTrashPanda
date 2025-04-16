import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme, colors, typography, spacing, borders } from './designSystem';

/**
 * Design System Showcase Component
 * 
 * This component provides a visual representation of the HarvestLink design system.
 * It can be used as a reference for developers and designers.
 */
const DesignSystemShowcase = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>HarvestLink Design System</Text>
      
      {/* Color Palette Section */}
      <SectionTitle title="Color Palette" />
      
      <SubsectionTitle title="Primary Colors (Green)" />
      <View style={styles.colorRow}>
        <ColorSwatch color={colors.primary.lightest} name="Lightest" hex="#E3F1E3" />
        <ColorSwatch color={colors.primary.light} name="Light" hex="#A5D6A7" />
        <ColorSwatch color={colors.primary.main} name="Main" hex="#4CAF50" />
        <ColorSwatch color={colors.primary.dark} name="Dark" hex="#2E7D32" />
        <ColorSwatch color={colors.primary.darkest} name="Darkest" hex="#1B5E20" />
      </View>
      
      <SubsectionTitle title="Secondary Colors (Earthy)" />
      <View style={styles.colorRow}>
        <ColorSwatch color={colors.secondary.lightest} name="Lightest" hex="#F1EBE4" />
        <ColorSwatch color={colors.secondary.light} name="Light" hex="#D7CCC8" />
        <ColorSwatch color={colors.secondary.main} name="Main" hex="#8D6E63" />
        <ColorSwatch color={colors.secondary.dark} name="Dark" hex="#5D4037" />
        <ColorSwatch color={colors.secondary.darkest} name="Darkest" hex="#3E2723" />
      </View>
      
      <SubsectionTitle title="Accent Colors (Amber)" />
      <View style={styles.colorRow}>
        <ColorSwatch color={colors.accent.lightest} name="Lightest" hex="#FFF8E1" />
        <ColorSwatch color={colors.accent.light} name="Light" hex="#FFE082" />
        <ColorSwatch color={colors.accent.main} name="Main" hex="#FFC107" />
        <ColorSwatch color={colors.accent.dark} name="Dark" hex="#FFA000" />
        <ColorSwatch color={colors.accent.darkest} name="Darkest" hex="#FF8F00" />
      </View>
      
      <SubsectionTitle title="Feedback Colors" />
      <View style={styles.colorRow}>
        <ColorSwatch color={colors.success.main} name="Success" hex="#4CAF50" />
        <ColorSwatch color={colors.warning.main} name="Warning" hex="#FFC107" />
        <ColorSwatch color={colors.error.main} name="Error" hex="#F44336" />
        <ColorSwatch color={colors.info.main} name="Info" hex="#2196F3" />
      </View>
      
      <SubsectionTitle title="Neutral Colors" />
      <View style={styles.colorRow}>
        <ColorSwatch color={colors.neutral.white} name="White" hex="#FFFFFF" border />
        <ColorSwatch color={colors.neutral.lightest} name="Lightest" hex="#F5F5F5" border />
        <ColorSwatch color={colors.neutral.light} name="Light" hex="#E0E0E0" />
        <ColorSwatch color={colors.neutral.medium} name="Medium" hex="#9E9E9E" />
        <ColorSwatch color={colors.neutral.dark} name="Dark" hex="#616161" />
        <ColorSwatch color={colors.neutral.darkest} name="Darkest" hex="#212121" />
        <ColorSwatch color={colors.neutral.black} name="Black" hex="#000000" />
      </View>
      
      {/* Typography Section */}
      <SectionTitle title="Typography" />
      
      <SubsectionTitle title="Headings" />
      <Text style={styles.h1}>Heading 1 (Montserrat Bold)</Text>
      <Text style={styles.h2}>Heading 2 (Montserrat Bold)</Text>
      <Text style={styles.h3}>Heading 3 (Montserrat SemiBold)</Text>
      <Text style={styles.h4}>Heading 4 (Montserrat SemiBold)</Text>
      <Text style={styles.h5}>Heading 5 (Montserrat Medium)</Text>
      
      <SubsectionTitle title="Body Text" />
      <Text style={styles.bodyLarge}>Body Large - This is larger body text used for important content. (Inter Regular)</Text>
      <Text style={styles.body}>Body - This is the standard body text used for most content throughout the application. (Inter Regular)</Text>
      <Text style={styles.bodySmall}>Body Small - This is smaller body text used for secondary information. (Inter Regular)</Text>
      
      <SubsectionTitle title="Special Text Styles" />
      <Text style={styles.caption}>CAPTION - Used for captions and fine print (Inter Regular)</Text>
      <Text style={styles.button}>BUTTON - Used for button text (Inter Medium)</Text>
      <Text style={styles.label}>LABEL - Used for form labels and small headers (Inter Medium)</Text>
      
      {/* Component Examples */}
      <SectionTitle title="Component Examples" />
      
      <SubsectionTitle title="Buttons" />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Primary Button</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Secondary Button</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>Outline Button</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.textButton}>
          <Text style={styles.textButtonText}>Text Button</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accentButton}>
          <Text style={styles.accentButtonText}>Accent Button</Text>
        </TouchableOpacity>
      </View>
      
      <SubsectionTitle title="Cards" />
      <View style={styles.cardContainer}>
        <View style={styles.standardCard}>
          <Text style={styles.cardTitle}>Standard Card</Text>
          <Text style={styles.cardBody}>This is a standard card with medium elevation.</Text>
        </View>
        
        <View style={styles.elevatedCard}>
          <Text style={styles.cardTitle}>Elevated Card</Text>
          <Text style={styles.cardBody}>This card has higher elevation for emphasis.</Text>
        </View>
        
        <View style={styles.outlinedCard}>
          <Text style={styles.cardTitle}>Outlined Card</Text>
          <Text style={styles.cardBody}>This card uses a border instead of elevation.</Text>
        </View>
        
        <View style={styles.flatCard}>
          <Text style={styles.cardTitle}>Flat Card</Text>
          <Text style={styles.cardBody}>This card has no elevation, just a subtle background.</Text>
        </View>
      </View>
      
      <SubsectionTitle title="Form Elements" />
      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Text Input</Text>
        <View style={styles.input}>
          <Text style={styles.inputPlaceholder}>Enter text here...</Text>
        </View>
        
        <View style={styles.checkboxContainer}>
          <View style={styles.checkbox} />
          <Text style={styles.checkboxLabel}>Checkbox Label</Text>
        </View>
        
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxChecked}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <Text style={styles.checkboxLabel}>Checked Checkbox</Text>
        </View>
        
        <View style={styles.radioContainer}>
          <View style={styles.radio} />
          <Text style={styles.radioLabel}>Radio Button Label</Text>
        </View>
        
        <View style={styles.radioContainer}>
          <View style={styles.radio}>
            <View style={styles.radioInner} />
          </View>
          <Text style={styles.radioLabel}>Selected Radio Button</Text>
        </View>
      </View>
      
      <View style={styles.spacer} />
    </ScrollView>
  );
};

// Helper Components
const SectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const SubsectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.subsectionTitle}>{title}</Text>
);

const ColorSwatch = ({ color, name, hex, border = false }: { color: string, name: string, hex: string, border?: boolean }) => (
  <View style={styles.colorSwatchContainer}>
    <View style={[styles.colorSwatch, { backgroundColor: color }, border && styles.swatchBorder]} />
    <Text style={styles.colorName}>{name}</Text>
    <Text style={styles.colorHex}>{hex}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    padding: spacing[6],
  },
  pageTitle: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold.toString(),
    color: colors.neutral.darkest,
    marginBottom: spacing[8],
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold.toString(),
    color: colors.primary.dark,
    marginTop: spacing[10],
    marginBottom: spacing[6],
    borderBottomWidth: borders.width.thin,
    borderBottomColor: colors.primary.light,
    paddingBottom: spacing[2],
  },
  subsectionTitle: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold.toString(),
    color: colors.secondary.dark,
    marginTop: spacing[6],
    marginBottom: spacing[4],
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing[6],
  },
  colorSwatchContainer: {
    marginRight: spacing[4],
    marginBottom: spacing[4],
    alignItems: 'center',
  },
  colorSwatch: {
    width: 80,
    height: 80,
    borderRadius: borders.radius.md,
  },
  swatchBorder: {
    borderWidth: borders.width.thin,
    borderColor: colors.neutral.light,
  },
  colorName: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing[2],
    color: colors.neutral.dark,
  },
  colorHex: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.neutral.medium,
  },
  
  // Typography styles
  h1: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold.toString(),
    lineHeight: typography.lineHeight.tight * typography.fontSize['4xl'],
    color: colors.neutral.darkest,
    marginBottom: spacing[4],
  },
  h2: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold.toString(),
    lineHeight: typography.lineHeight.tight * typography.fontSize['3xl'],
    color: colors.neutral.darkest,
    marginBottom: spacing[4],
  },
  h3: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semiBold.toString(),
    lineHeight: typography.lineHeight.tight * typography.fontSize['2xl'],
    color: colors.neutral.darkest,
    marginBottom: spacing[3],
  },
  h4: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold.toString(),
    lineHeight: typography.lineHeight.tight * typography.fontSize.xl,
    color: colors.neutral.darkest,
    marginBottom: spacing[3],
  },
  h5: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium.toString(),
    lineHeight: typography.lineHeight.tight * typography.fontSize.lg,
    color: colors.neutral.darkest,
    marginBottom: spacing[3],
  },
  bodyLarge: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.regular.toString(),
    lineHeight: typography.lineHeight.normal * typography.fontSize.lg,
    color: colors.neutral.darkest,
    marginBottom: spacing[3],
  },
  body: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.regular.toString(),
    lineHeight: typography.lineHeight.normal * typography.fontSize.md,
    color: colors.neutral.darkest,
    marginBottom: spacing[3],
  },
  bodySmall: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular.toString(),
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
    color: colors.neutral.darkest,
    marginBottom: spacing[3],
  },
  caption: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular.toString(),
    lineHeight: typography.lineHeight.normal * typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.wide,
    color: colors.neutral.dark,
    marginBottom: spacing[3],
  },
  button: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium.toString(),
    lineHeight: typography.lineHeight.tight * typography.fontSize.md,
    letterSpacing: typography.letterSpacing.wide,
    color: colors.primary.main,
    textTransform: 'uppercase',
    marginBottom: spacing[3],
  },
  label: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium.toString(),
    lineHeight: typography.lineHeight.tight * typography.fontSize.sm,
    letterSpacing: typography.letterSpacing.wide,
    color: colors.neutral.dark,
    marginBottom: spacing[3],
  },
  
  // Button styles
  buttonContainer: {
    marginBottom: spacing[8],
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borders.radius.md,
    padding: spacing[3],
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  primaryButtonText: {
    color: colors.neutral.white,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium.toString(),
  },
  secondaryButton: {
    backgroundColor: colors.secondary.main,
    borderRadius: borders.radius.md,
    padding: spacing[3],
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  secondaryButtonText: {
    color: colors.neutral.white,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium.toString(),
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: borders.width.medium,
    borderColor: colors.primary.main,
    borderRadius: borders.radius.md,
    padding: spacing[3],
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  outlineButtonText: {
    color: colors.primary.main,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium.toString(),
  },
  textButton: {
    backgroundColor: 'transparent',
    padding: spacing[3],
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  textButtonText: {
    color: colors.primary.main,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium.toString(),
  },
  accentButton: {
    backgroundColor: colors.accent.main,
    borderRadius: borders.radius.md,
    padding: spacing[3],
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  accentButtonText: {
    color: colors.neutral.darkest,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium.toString(),
  },
  
  // Card styles
  cardContainer: {
    marginBottom: spacing[8],
  },
  standardCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.radius.lg,
    padding: spacing[6],
    marginBottom: spacing[6],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  elevatedCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.radius.lg,
    padding: spacing[6],
    marginBottom: spacing[6],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  outlinedCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borders.radius.lg,
    borderWidth: borders.width.thin,
    borderColor: colors.neutral.light,
    padding: spacing[6],
    marginBottom: spacing[6],
  },
  flatCard: {
    backgroundColor: colors.neutral.lightest,
    borderRadius: borders.radius.lg,
    padding: spacing[6],
    marginBottom: spacing[6],
  },
  cardTitle: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold.toString(),
    color: colors.neutral.darkest,
    marginBottom: spacing[2],
  },
  cardBody: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    color: colors.neutral.dark,
  },
  
  // Form styles
  formContainer: {
    marginBottom: spacing[8],
  },
  inputLabel: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium.toString(),
    color: colors.neutral.dark,
    marginBottom: spacing[2],
  },
  input: {
    height: spacing[12],
    backgroundColor: colors.neutral.white,
    borderWidth: borders.width.thin,
    borderColor: colors.neutral.light,
    borderRadius: borders.radius.md,
    padding: spacing[3],
    marginBottom: spacing[4],
    justifyContent: 'center',
  },
  inputPlaceholder: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    color: colors.neutral.medium,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  checkbox: {
    width: spacing[5],
    height: spacing[5],
    borderWidth: borders.width.thin,
    borderColor: colors.neutral.medium,
    borderRadius: borders.radius.sm,
    marginRight: spacing[3],
  },
  checkboxChecked: {
    width: spacing[5],
    height: spacing[5],
    backgroundColor: colors.primary.main,
    borderWidth: borders.width.thin,
    borderColor: colors.primary.main,
    borderRadius: borders.radius.sm,
    marginRight: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.neutral.white,
    fontSize: typography.fontSize.sm,
  },
  checkboxLabel: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    color: colors.neutral.darkest,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  radio: {
    width: spacing[5],
    height: spacing[5],
    borderWidth: borders.width.thin,
    borderColor: colors.neutral.medium,
    borderRadius: 999,
    marginRight: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: spacing[2],
    height: spacing[2],
    backgroundColor: colors.primary.main,
    borderRadius: 999,
  },
  radioLabel: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    color: colors.neutral.darkest,
  },
  
  spacer: {
    height: spacing[16],
  },
});

export default DesignSystemShowcase;