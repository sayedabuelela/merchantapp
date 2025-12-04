# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

React Native merchant mobile app built with Expo and TypeScript for Kashier payment platform. Supports English/Arabic with RTL layout capabilities.

## Commands

- `npm start` - Start Expo dev server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run lint` - Run ESLint

**Testing:** Minimal test coverage. Tests in `__tests__` directories. No dedicated test command.

## Architecture

### Directory Structure

**app/** - Expo Router file-based routing
- `(tabs)/`, `(auth)/`, `(onboarding)/`, `(profile)/` - Route groups
- `payment-links/`, `payments/` - Feature routes
- `_layout.tsx` - Root layout with providers

**src/core/** - Core infrastructure
- `api/` - Axios clients with interceptors
- `environment/` - Environment/mode switching (staging/prod, test/live)
- `providers/` - Global providers (Language, Toast, Notifications, Splash)
- `hooks/`, `utils/`, `constants/`

**src/modules/[feature]/** - Feature modules
- `*.model.ts` - Type definitions
- `*.services.ts` - API service functions
- `*.store.ts` - Zustand state management
- `viewmodels/` - Business logic hooks
- `views/` - Screen components
- `components/` - Feature-specific UI

**src/shared/** - Shared resources
- `components/` - Reusable UI (ListHeader, ListTabs, etc.)
- `localization/` - i18n translations
- `assets/` - Images, fonts, SVGs

### Key Patterns

**Module Organization**: Consistent structure - models, services, stores, viewmodels, views, components. Clear separation of data, logic, and presentation.

**Component Reusability**:
- **Adapter Pattern**: Normalize different data sources into common interfaces. Use adapter functions + smart wrapper components. See settlement components working for both orders and transactions.
- **TypeScript Generics**: Type-safe components working with different data types (e.g., `DetailsTabs<T>`)
- **Shared Components**: Extract common UI patterns to `src/shared/components/`

**Navigation**: Expo Router with file-based routing. Root `_layout.tsx` wraps providers. Protected routes use `Stack.Protected` with auth guards.

**State Management**:
- Zustand + persist middleware for global state (auth, environment)
- React Query for server state
- React Context for theme/language

**API Architecture**:
- Two Axios instances (main API, payment API) via `useApi()` hook
- Environment-aware: staging/production + test/live modes
- Centralized interceptors for auth and error handling
- Config: `src/core/environment/environments.ts`

**Authentication**:
- Store: `src/modules/auth/auth.store.ts`
- Token storage: Expo SecureStore + AsyncStorage fallback
- Interceptors: `src/core/api/clients.interceptors.ts`

**Internationalization**:
- i18next with English/Arabic support
- RTL requires app reload via `expo-updates`
- Translations: `src/shared/localization/locales/`

**Styling**:
- NativeWind (TailwindCSS for React Native)
- Custom theme in `tailwind.config.js`
- RTL/LTR fonts: Cairo/Outfit (head), Noto Naskh Arabic/Noto Sans (body)
- Use font utilities from `src/core/utils/fonts.ts` - never hardcode

**Type Safety**:
- Strict TypeScript enabled
- Path alias `@/*` maps to project root

## Development Guidelines

### Creating New Feature Modules
1. Create `src/modules/[feature-name]/`
2. Add `*.model.ts` (types), `*.services.ts` (API calls), `*.store.ts` (if needed)
3. Create `viewmodels/` (business logic), `views/` (screens), `components/` (UI)

### Best Practices
- **API Calls**: Always use `useApi()` hook - never hardcode URLs or create standalone Axios instances
- **Routing**: Place screens in appropriate route groups in `app/` directory. Use parentheses for hidden routes: `(tabs)`, `(auth)`
- **Fonts**: Use utilities from `src/core/utils/fonts.ts` - never hardcode font classes
- **Date/Time**: Use utilities from `src/core/utils/dateUtils.ts` for consistent formatting
- **Shared Components**: Before creating new components, check if similar patterns exist in `src/shared/components/`
- **Reusability**: Use TypeScript generics or adapter pattern over code duplication

## Shared Components

**ListHeader** (`src/shared/components/ListHeader/`)
- Reusable header for list screens with search, filter toggle, and optional action button
- Used by payment-links, activities, payments modules

**ListTabs** (`src/shared/components/ListTabs/`)
- Generic tabs component with TypeScript generics for type-safe values
- Animated tab switching with Moti

**DetailsTabs** (`src/modules/payments/components/detail/`)
- Generic tab switcher for detail screens (Details, Settlement, History)
- Works for both orders and transactions via generics

**StickyHeaderList** (`src/shared/components/StickyHeaderList/`)
- List component with sticky date headers
- Supports forwardRef for scroll-to-top on tab changes

## Payments Module

Handles payment sessions (orders) and transactions with filtering and detail views.

### Key Components
- **List View**: Tab switching between orders and transactions with infinite scroll
- **Filter Modal**: Comprehensive filtering with tab-specific options (separate states for orders/transactions)
- **Detail Screens**: Order and transaction details with tabbed interface (Details, Settlement, History)
- **Actions Modal**: Long-press on cards opens bottom sheet with quick actions

### Important Implementation Notes
- **Orders API**: `GET /v3/payment/sessions` - uses `dateFrom`/`dateTo` params, response in `data` field
- **Transactions API**: `GET /v2/aggregator/transactions` - uses `startDate`/`endDate` (ISO format), response in `body` field
- **ViewModels**: Use `useInfiniteQuery` with date grouping and sticky headers (5-min stale time)
- **Payment Types**: Card, VALU, Wallet, Cash - use type guards (`isCardPayment`, `isValuPayment`, etc.)
- **Settlement Components**: Use adapter pattern - `adaptOrderData()` and `adaptTransactionData()` normalize to `SettlementData` interface
- **History Tab**: Complete timeline with contextual icons and bilingual error messages

## Common Patterns

**Actions Modal Pattern**:
- Long-press on list items opens bottom sheet with quick actions
- Regular tap navigates to details (use Link with `asChild` prop)
- Use type guards for handling different data types

**Scroll-to-Top Pattern**:
- Tabbed list screens scroll to top on tab change
- `StickyHeaderList` supports `forwardRef` for this purpose
- Use `listRef.current?.scrollToOffset({ offset: 0, animated: true })`

**Wrapper Pattern**:
- Create thin wrappers around shared components for better semantics
- Example: `PaymentsHeader` wraps `ListHeader` with feature-specific tab options
- Maintains naming clarity while reusing logic

## Utilities

**Logger** (`src/core/utils/logger.ts`):
- Use `logJSON(label, data)` instead of `console.log` for formatted JSON output

**Formatters** (`src/modules/payments/utils/formatters.ts`):
- `formatAmount()` - Monetary values with EGP currency
- `formatText()` - Text fields with fallback
- `capitalizeWords()` - camelCase to Title Case

**Date/Time** (`src/core/utils/dateUtils.ts`):
- `formatAMPM()` - Time formatting
- `formatRelativeDate()` - Relative date display
- `groupByDate()` - Group list items by date

## Platform-Specific

**iOS**: `ios/Kashier.xcodeproj/` - May need `cd ios && pod install` for native deps

**Android**: `android/` - Firebase config in `google-services.json`

## Common Gotchas

- **RTL Changes**: Language changes affecting RTL require full app reload via `expo-updates`
- **Environment/Mode**: Changes affect API base URLs - verify correct environment is set
- **Native Modules**: Some require development builds - cannot use Expo Go
- **SVG Imports**: Require `react-native-svg-transformer` config in `metro.config.js`
- **Performance**: Use best practices, avoid unnecessary re-renders, but don't over-engineer with excessive useMemo/useCallback
- **Production Stability**: Don't break existing working functionality when fixing issues or adding features
- **Filters**: With multiple tabs/views, maintain separate filter states to avoid param conflicts
- **Component Reuse**: Check for existing shared components before creating new ones
- **Type Handling**: Prefer TypeScript generics or adapter pattern over code duplication
- **Consolidation**: Refactor duplicate components into shared implementations when found
