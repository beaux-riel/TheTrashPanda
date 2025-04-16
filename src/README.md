# HarvestLink Project Structure

This document outlines the project structure and architecture for the HarvestLink mobile application.

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation
- **Backend Integration**: Supabase
- **Form Handling**: Formik with Yup validation
- **Styling**: React Native StyleSheet with design system

## Directory Structure

```
src/
├── api/                  # API services and endpoints
├── assets/               # Static assets (images, fonts)
│   ├── fonts/
│   └── images/
├── components/           # Reusable UI components
│   ├── common/           # Shared components used across the app
│   ├── consumer/         # Components specific to consumer screens
│   └── producer/         # Components specific to producer screens
├── config/               # Configuration files
├── constants/            # Application constants
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── navigation/           # Navigation configuration
├── screens/              # Screen components
│   ├── consumer/         # Consumer-facing screens
│   ├── producer/         # Producer-facing screens
│   └── shared/           # Shared screens (auth, etc.)
├── services/             # Business logic services
├── stores/               # Zustand state stores
├── styles/               # Global styles and theme
│   └── designSystem.ts   # Design system tokens
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Key Architecture Decisions

### Why Expo?

Expo was chosen for the following reasons:
- Faster development cycle with hot reloading
- Simplified build process
- Access to a wide range of pre-built native modules
- OTA updates capability
- Excellent documentation and community support
- Ability to eject to bare workflow if needed in the future

### State Management with Zustand

Zustand was selected over alternatives like Redux or MobX for the following reasons:
- Minimal boilerplate code
- Simple and intuitive API
- Built-in persistence capabilities
- TypeScript support
- Small bundle size
- Performance optimizations

### Navigation Structure

The app uses a nested navigation structure:
- Root Navigator: Handles authentication state and routes to appropriate stacks
- Auth Navigator: Manages authentication screens (login, register, etc.)
- Consumer Stack: Contains screens for consumer users
- Producer Stack: Contains screens for producer users
- Tab Navigators: Handle the main tabs for each user type

### Environment Configuration

The app supports multiple environments:
- Development
- Staging
- Production

Environment variables are managed through:
- `.env` files (not committed to version control)
- `react-native-dotenv` for accessing environment variables
- Environment-specific configuration in `src/config/env.ts`

## Coding Standards

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Using `eslint-config-universe` for React Native
- **Prettier**: For consistent code formatting
- **Component Structure**: Functional components with hooks
- **Styling**: Component-specific styles using StyleSheet
- **Naming Conventions**: 
  - PascalCase for components and types
  - camelCase for variables, functions, and instances
  - UPPER_CASE for constants

## Getting Started

1. Install dependencies: `npm install` or `yarn install`
2. Copy `.env.example` to `.env` and fill in your environment variables
3. Start the development server: `npm start` or `yarn start`
4. Run on iOS: `npm run ios` or `yarn ios`
5. Run on Android: `npm run android` or `yarn android`