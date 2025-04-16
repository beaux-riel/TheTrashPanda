import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationHook {
  location: LocationData | null;
  address: string | null;
  loading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationData | null>;
  getAddressFromCoordinates: (coords: LocationData) => Promise<string | null>;
  getCoordinatesFromAddress: (address: string) => Promise<LocationData | null>;
}

export const useLocation = (): LocationHook => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Request location permissions
  const requestPermission = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        
        // Show alert with instructions to enable location
        Alert.alert(
          'Location Permission Required',
          'HarvestLink needs access to your location to find farms near you. Please enable location services in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Location.openSettings();
                } else {
                  // For Android
                  Location.openApplicationSettings();
                }
              } 
            },
          ]
        );
        
        setLoading(false);
        return false;
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      setError('Error requesting location permission');
      setLoading(false);
      return false;
    }
  };

  // Get current location
  const getCurrentLocation = async (): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const permissionGranted = await requestPermission();
      
      if (!permissionGranted) {
        setLoading(false);
        return null;
      }
      
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const locationData: LocationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
      };
      
      setLocation(locationData);
      
      // Get address for the location
      const addressResult = await getAddressFromCoordinates(locationData);
      setAddress(addressResult);
      
      setLoading(false);
      return locationData;
    } catch (err) {
      setError('Error getting current location');
      setLoading(false);
      return null;
    }
  };

  // Get address from coordinates
  const getAddressFromCoordinates = async (coords: LocationData): Promise<string | null> => {
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      
      if (addressResponse && addressResponse.length > 0) {
        const addressObj = addressResponse[0];
        const formattedAddress = [
          addressObj.name,
          addressObj.street,
          addressObj.city,
          addressObj.region,
          addressObj.postalCode,
          addressObj.country,
        ]
          .filter(Boolean)
          .join(', ');
        
        return formattedAddress;
      }
      
      return null;
    } catch (err) {
      setError('Error getting address from coordinates');
      return null;
    }
  };

  // Get coordinates from address
  const getCoordinatesFromAddress = async (addressString: string): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const geocodeResult = await Location.geocodeAsync(addressString);
      
      if (geocodeResult && geocodeResult.length > 0) {
        const coords: LocationData = {
          latitude: geocodeResult[0].latitude,
          longitude: geocodeResult[0].longitude,
        };
        
        setLocation(coords);
        setAddress(addressString);
        setLoading(false);
        return coords;
      }
      
      setError('Address not found');
      setLoading(false);
      return null;
    } catch (err) {
      setError('Error geocoding address');
      setLoading(false);
      return null;
    }
  };

  // Initialize location on component mount
  useEffect(() => {
    // Check if we already have permission
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status === 'granted') {
        getCurrentLocation();
      }
    })();
  }, []);

  return {
    location,
    address,
    loading,
    error,
    requestPermission,
    getCurrentLocation,
    getAddressFromCoordinates,
    getCoordinatesFromAddress,
  };
};