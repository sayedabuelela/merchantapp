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
├── payments/                 # Payment sessions and transactions
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
├── modules/                  # Feature modules (auth, balance, payment-links, payments, onboarding, settings, notifications)
│   └── [feature]/
│       ├── *.model.ts        # Type definitions
│       ├── *.services.ts     # API service functions
│       ├── *.store.ts        # Zustand state management
│       ├── *.hooks.ts        # Feature-specific hooks
│       ├── viewmodels/       # View model hooks (business logic)
│       ├── views/            # Screen components
│       └── components/       # Feature-specific components
└── shared/                   # Shared UI and utilities
    ├── components/           # Reusable UI components (ListHeader, ListTabs, etc.)
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

## Shared Components

### ListHeader
Generic reusable header component for list screens located at `src/shared/components/ListHeader/ListHeader.tsx`.

**Features:**
- Search functionality with clear button
- Filter toggle button with active indicator
- Optional action button (e.g., "+" for creating new items)
- Eliminates code duplication across multiple feature modules

**Usage:**
```typescript
<ListHeader
    title="Screen Title"
    onFilterPress={() => setIsFiltersOpen(!isFiltersOpen)}
    onSubmitSearch={handleSearchChange}
    isFilterOpen={isFiltersOpen}
    isListEmpty={isListEmpty}
    hasFilters={hasActiveFilters}
    handleClearSearch={handleClearSearch}
    searchValue={search}
    actionButton={{
        icon: <PlusIcon size={24} color="#fff" />,
        onPress: handleCreate
    }}
/>
```

### ListTabs
Generic tabs component with animation and TypeScript generics located at `src/shared/components/ListTabs/ListTabs.tsx`.

**Features:**
- Type-safe tab values using generics
- Animated tab switching with Moti
- Customizable tab options

**Usage:**
```typescript
const tabs: Tab<string>[] = [
    { label: t('Orders'), value: 'sessions' },
    { label: t('Transactions'), value: 'transactions' }
];

<ListTabs
    tabs={tabs}
    value={activeTab}
    onSelectType={setActiveTab}
    isListEmpty={isListEmpty}
/>
```

## Payments Module

The payments module (`src/modules/payments/`) handles payment sessions (orders) and transactions with comprehensive filtering capabilities.

### Structure

```
src/modules/payments/
├── payments.model.ts           # TypeScript interfaces for both APIs
├── payments.services.ts        # API service functions
├── viewmodels/
│   ├── useOrdersVM.ts         # Orders (sessions) view model with infinite scroll
│   └── useTransactionsVM.ts   # Transactions view model with infinite scroll
├── views/
│   └── list.tsx               # Main payments screen with tab switching
└── components/
    ├── PaymentsTabs.tsx       # Wrapper around ListTabs
    ├── PaymentFilterModal.tsx # Comprehensive filter modal
    ├── header/
    │   └── PaymentsHeader.tsx # Wrapper around ListHeader
    ├── orders-list/
    │   └── OrderCard.tsx      # Payment session card component
    └── transactions-list/
        └── TransactionCard.tsx # Transaction card component
```

### Key APIs

**Orders (Sessions):**
- Endpoint: `GET /v3/payment/sessions`
- Model: `FetchSessionsParams`, `FetchSessionsResponse`
- Returns: Payment sessions with stats (paid/unpaid orders)

**Transactions:**
- Endpoint: `GET /v2/aggregator/transactions`
- Model: `FetchTransactionsParams`, `FetchTransactionsResponse`
- Returns: Transaction details with pagination

**Discounts:**
- Endpoint: `GET /v2/discounts`
- Returns: Array of discount names for filter dropdown

**Branches:**
- Endpoint: `GET /v3/payment/pos/branches`
- Returns: List of POS branches for filter dropdown

### Filter System

The `PaymentFilterModal` component implements a comprehensive filtering system with tab-specific options:

**Shared Filters (both tabs):**
- Payment date range (different param names per tab)
- Channel: Online, POS, E-commerce
- Payment method: Card, Wallet, Valu, Cash, OCTO, Souhoola, Contact, Basata, Aman, Instapay
- Branch: Dynamic from API (`/v3/payment/pos/branches`)
- Status: Different options per tab

**Orders Only:**
- Payment status: CREATE, OPENED, PENDING, PAID, FAILED, EXPIRED, AUTHORIZED, REFUNDED, PARTIALLY REFUND, REFUND PENDING, VOIDED, REVERSED, REJECTED, ABANDONED
- Payment source: Payment Link, Payment Page, Product Page, integration

**Transactions Only:**
- Transaction status: Approved, Rejected, Unknown
- Transaction type: PAYMENT, REFUND, REVERSAL
- Discount: Dynamic from API (`/v2/discounts`)

**Implementation Details:**
- Separate filter states for orders vs transactions (`ordersFilters`, `transactionsFilters`)
- Date formatting: `formatDateString()` for orders, `.toISOString()` for transactions
- Only sends filter params with values (null → undefined conversion)
- Dynamic dropdowns fetch data with React Query (10min cache)
- Conditional rendering based on `currentTab` prop

### ViewModels Pattern

Both `useOrdersVM` and `useTransactionsVM` follow the same pattern:

```typescript
export const useOrdersVM = (params?: FetchSessionsParams) => {
    const { api } = useApi();

    const ordersQuery = useInfiniteQuery<...>({
        queryKey: ["payment-orders", params],
        queryFn: ({ pageParam = 1 }) =>
            fetchPaymentSessions(api, { ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000,
    });

    // Group data by date and return with sticky header indices
    const allItems = ordersQuery.data?.pages.flatMap((p) => p.data) ?? [];
    const grouped = groupByDate(allItems, 'createdAt');
    const { listData, stickyHeaderIndices } = useGroupedData(allItems.length ? grouped : []);

    return {
        ...ordersQuery,
        listData,
        stickyHeaderIndices,
        stats: ordersQuery.data?.pages[0]?.stats,
    };
};
```

**Key features:**
- Infinite scroll with React Query's `useInfiniteQuery`
- Automatic date grouping with sticky headers
- 5-minute stale time for optimal caching
- Query key includes params for proper cache invalidation

### Important Notes

1. **Different Date Param Names:**
   - Orders use: `dateFrom`, `dateTo` (formatted with `formatDateString()`)
   - Transactions use: `startDate`, `endDate` (ISO format)

2. **Different Response Structures:**
   - Orders: `response.data` contains array
   - Transactions: `response.body` contains array

3. **Service Functions:**
   - Only send params that have truthy values
   - Use conditional checks before adding to queryParams object
   - Example: `if (dateFrom) queryParams.dateFrom = dateFrom;`

4. **Filter Modal:**
   - Memoized with `memo()` to prevent unnecessary re-renders
   - Uses Moti for smooth animations
   - Keyboard-aware with `KeyboardController`
   - Disabled "Apply Filters" button when no filters are selected

## Platform-Specific Notes

### iOS
- Xcode project at `ios/Kashier.xcodeproj/`
- Native dependencies may require pod install: `cd ios && pod install`
- Context menus use `react-native-ios-context-menu`

### Android
- Android project at `android/`
- Firebase configuration in `google-services.json`

## Code Reusability and DRY Principle

The codebase follows the DRY (Don't Repeat Yourself) principle through shared components and wrapper patterns:

### Shared Component Pattern
When multiple feature modules have similar UI patterns (e.g., headers with search/filter, tabs), extract them into shared components:

1. **Create generic component** in `src/shared/components/[ComponentName]/`
2. **Use TypeScript generics** for type safety (e.g., `ListTabs<T>`)
3. **Make optional props** for customization (e.g., `actionButton` in ListHeader)
4. **Create feature-specific wrappers** for semantic naming

**Example:** `PaymentLinksHeader`, `ActivitiesHeader`, and `PaymentsHeader` all use the shared `ListHeader` component, reducing ~60 lines of duplicate code per feature.

### Wrapper Pattern
Feature modules can create thin wrappers around shared components for better semantics:

```typescript
// src/modules/payments/components/PaymentsTabs.tsx
const PaymentsTabs = ({ value, onSelectType, isListEmpty }: PaymentsTabsProps) => {
    const { t } = useTranslation();

    const tabs: Tab<string>[] = [
        { label: t('Orders'), value: 'sessions' },
        { label: t('Transactions'), value: 'transactions' }
    ];

    return <ListTabs tabs={tabs} value={value} onSelectType={onSelectType} isListEmpty={isListEmpty} />;
};
```

This approach maintains feature-specific naming while reusing shared logic.

## Common Gotchas

- Language changes that affect RTL require full app reload (`expo-updates`)
- Environment/mode changes affect API base URLs - ensure correct environment is set
- Some native modules require development builds, cannot use Expo Go
- SVG imports require `react-native-svg-transformer` configuration in `metro.config.js`
- dont over engineering only best practice and prevent unnecessary re renders without over using usecallbacks or usememo
- try to dont break any thing that arleady works while you fix an issue or add new feature this is a production grade app
- When implementing filters with multiple tabs/views, maintain separate filter states to avoid param name conflicts
- Always check if similar UI patterns already exist as shared components before creating new ones