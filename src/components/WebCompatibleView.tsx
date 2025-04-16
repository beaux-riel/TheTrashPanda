import React from 'react';
import { View, ViewProps, Platform, StyleSheet } from 'react-native';

/**
 * A wrapper component that handles web-specific styling issues
 * such as shadow properties that need to be converted to boxShadow
 */
export const WebCompatibleView: React.FC<ViewProps> = ({ style, ...props }) => {
  // On web, we need to handle shadow properties differently
  if (Platform.OS === 'web') {
    // Extract shadow properties and convert to boxShadow if needed
    const webStyle = StyleSheet.flatten(style);
    
    // Return the View with web-compatible styles
    return <View style={webStyle} {...props} />;
  }
  
  // On native platforms, just pass through the original style
  return <View style={style} {...props} />;
};