export default {
  name: "HarvestLink",
  slug: "harvestlink",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic", // Support both light and dark mode
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/your-project-id" // For EAS Update
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.harvestlink.app",
    buildNumber: "1.0.0",
    infoPlist: {
      NSCameraUsageDescription: "HarvestLink uses your camera to take photos of products and scan QR codes.",
      NSLocationWhenInUseUsageDescription: "HarvestLink uses your location to find nearby farms and pickup points.",
      NSPhotoLibraryUsageDescription: "HarvestLink needs access to your photo library to upload product images."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#FFFFFF"
    },
    package: "com.harvestlink.app",
    versionCode: 1,
    permissions: [
      "CAMERA",
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  },
  web: {
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-camera",
    "expo-image-picker",
    "expo-location",
    "expo-notifications",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static"
        }
      }
    ]
  ],
  extra: {
    eas: {
      projectId: "your-eas-project-id"
    }
  }
};