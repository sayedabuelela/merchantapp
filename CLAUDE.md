# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native merchant mobile application built with Expo and TypeScript. It's a payment processing app for merchants (Kashier payment platform) supporting both English and Arabic with RTL layout capabilities.

## Commands

### Development
```bash
npm start              # Start Expo development server
npm run android        # Run on Android emulator/device
npm run ios            # Run on iOS simulator/device
npm run lint           # Run ESLint
```

### Testing
The project has minimal test coverage. Existing tests are located in `__tests__` directories alongside source files. There is no dedicated test command configured.

## Architecture

### Directory Structure
```
app/                          # Expo Router file-based routing
├── (tabs)/                   # Tab-based navigation screens
├── (auth)/                   # Authentication flows
├── (onboarding)/             # Merchant onboarding
├── (profile)/                # Profile management
├── payment-links/            # Payment link creation/management
└── _layout.tsx               # Root layout with providers

src/
├── core/                     # Core utilities and infrastructure
│   ├── api/                  # Axios clients with interceptors
│   ├── environment/          # Environment/mode switching (staging/prod, test/live)
│   ├── contexts/             # React contexts
│   ├── providers/            # Global providers (Language, Toast, Notifications, Splash)
│   ├── hooks/                # Shared hooks
│   ├── utils/                # Utility functions
│   └── constants/            # Constants
├── modules/                  # Feature modules (auth, balance, payment-links, onboarding, settings, notifications)
│   └── [feature]/
│       ├── *.model.ts        # Type definitions
│       ├── *.services.ts     # API service functions
│       ├── *.store.ts        # Zustand state management
│       ├── *.hooks.ts        # Feature-specific hooks
│       ├── viewmodels/       # View model hooks (business logic)
│       ├── views/            # Screen components
│       └── components/       # Feature-specific components
└── shared/                   # Shared UI and utilities
    ├── components/           # Reusable UI components
    ├── localization/         # i18n configuration and translations
    └── assets/               # Images, fonts, SVGs
```

### Key Architectural Patterns

**Module Organization**: Each feature module follows a consistent structure with models, services, stores, viewmodels, views, and components. This separation ensures clear boundaries between data, logic, and presentation.

**Navigation**: Uses Expo Router with file-based routing. The root `_layout.tsx` wraps the app in providers (QueryClient, Language, Splash, Notification, Toast, Keyboard). Protected routes use `Stack.Protected` with guard conditions based on authentication state.

**State Management**:
- Zustand stores with persist middleware for global state (auth, environment)
- React Query (@tanstack/react-query) for server state
- React Context for theme/language concerns

**API Architecture**:
- Two Axios instances: main API and payment API
- Environment-aware: supports staging/production environments and test/live modes
- Centralized interceptors for auth headers and error handling
- Hook-based API access via `useApi()` which dynamically creates clients based on current environment/mode

**Environment Switching**: The app supports switching between:
- Environments: `staging` and `production`
- Modes: `test` and `live`
- Base URLs are configured in `src/core/environment/environments.ts`
- Current environment persisted in Zustand store

**Authentication**:
- Auth state managed in `src/modules/auth/auth.store.ts` using Zustand with persistence
- Token stored in hybrid storage (Expo SecureStore for sensitive data, AsyncStorage fallback)
- Auth interceptor adds token to requests in `src/core/api/clients.interceptors.ts`
- Protected routes in `_layout.tsx` use authentication guards

**Internationalization**:
- i18next with react-i18next for translations
- Supports English (LTR) and Arabic (RTL)
- RTL requires app reload via `expo-updates`
- Translation files in `src/shared/localization/locales/`
- Language state managed via Context, persisted in AsyncStorage

**Styling**:
- NativeWind (TailwindCSS for React Native)
- Custom theme with brand colors, typography, and design tokens in `tailwind.config.js`
- Font system supports RTL/LTR with separate font families:
  - Head fonts: Cairo (RTL), Outfit (LTR)
  - Body fonts: Noto Naskh Arabic (RTL), Noto Sans (LTR)
- Font classes dynamically generated based on language direction

**Type Safety**:
- Strict TypeScript enabled
- Path alias `@/*` maps to project root
- Models define data structures for each feature module

## Important Patterns

### Creating New Feature Modules
When adding new features, follow the established module structure:
1. Create directory in `src/modules/[feature-name]/`
2. Add model file (`*.model.ts`) with TypeScript types
3. Add services file (`*.services.ts`) for API calls
4. Add store file (`*.store.ts`) if persistent state needed
5. Create `viewmodels/` directory for business logic hooks
6. Create `views/` directory for screen components
7. Create `components/` directory for feature-specific UI components

### API Calls
Always use the `useApi()` hook to get API clients. Never hardcode URLs or create standalone Axios instances:
```typescript
const { api, paymentApi } = useApi();
```

### Routing
Place screens in appropriate route groups in the `app/` directory. Use parentheses for route groups that shouldn't appear in URL (e.g., `(tabs)`, `(auth)`).

### Font Usage
Use the utility functions in `src/core/utils/fonts.ts` to get correct font classes based on current language direction. Never hardcode font classes.

### Date/Time
Use utility functions in `src/core/utils/dateUtils.ts` for consistent date formatting and timezone handling.

## Platform-Specific Notes

### iOS
- Xcode project at `ios/Kashier.xcodeproj/`
- Native dependencies may require pod install: `cd ios && pod install`
- Context menus use `react-native-ios-context-menu`

### Android
- Android project at `android/`
- Firebase configuration in `google-services.json`

## Common Gotchas

- Language changes that affect RTL require full app reload (`expo-updates`)
- Environment/mode changes affect API base URLs - ensure correct environment is set
- Some native modules require development builds, cannot use Expo Go
- SVG imports require `react-native-svg-transformer` configuration in `metro.config.js`
- dont over engineering only best practice and prevent unnecessary re renders without over using usecallbacks or usememo
- try to dont break any thing that arleady works while you fix an issue or add new feature this is a production grade app