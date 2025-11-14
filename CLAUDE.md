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

**Adapter Pattern for Component Reusability**: When multiple data sources (e.g., orders and transactions) need to display similar UI components, use the adapter pattern:
1. Define a normalized interface (e.g., `SettlementData`)
2. Create adapter functions to transform each data source to the normalized interface
3. Build components that accept the normalized interface
4. Use thin wrapper components that handle adaptation and component selection

**Example:** The settlement components (`CashSettlementDetails`, `ValuSettlementDetails`, `WalletSettlementDetails`) work for both orders and transactions by:
- Accepting a common `SettlementData` interface
- Using adapters (`adaptOrderData`, `adaptTransactionData`) to normalize different data structures
- Having smart wrapper components that detect payment type and render appropriate components

This eliminates code duplication and ensures consistency across similar features.

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

### Component Reusability Strategies

When building components that need to work with multiple data types:

**1. TypeScript Generics:**
Use generics for components that have the same UI but work with different type-safe values.

Example: `DetailsTabs<T>` works for both `OrderDetailsTabType` and `TransactionDetailsTabType`:
```typescript
function DetailsTabs<T extends string>({ value, onSelectType }: Props<T>) {
    // Same component, different types!
}
```

**2. Adapter Pattern:**
Use adapters when components need to work with different data structures that represent similar concepts.

Steps:
1. Define a normalized interface (e.g., `SettlementData`)
2. Create adapter functions for each data source
3. Build components that accept the normalized interface
4. Use wrapper components for adaptation logic

Example: Settlement components work for both orders and transactions using `adaptOrderData()` and `adaptTransactionData()`.

**3. Shared Component Libraries:**
Extract common UI patterns into `src/shared/components/` when multiple features need the same component (e.g., `ListHeader`, `ListTabs`).

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
    │   └── OrderCard.tsx      # Payment session card component (supports long press)
    ├── transactions-list/
    │   └── TransactionCard.tsx # Transaction card component (supports long press)
    └── modals/
        └── ActionsModal/
            ├── ActionsModal.tsx # Payment actions bottom sheet
            ├── ActionItem.tsx   # Action button component
            └── index.tsx        # Export file
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

### Payment Detail Screens

The payments module includes comprehensive detail screens for both orders and transactions.

#### Structure

```
src/modules/payments/
├── viewmodels/
│   ├── useOrderDetailVM.ts        # Order detail view model with React Query
│   └── useTransactionDetailVM.ts  # Transaction detail view model with React Query
├── views/
│   ├── order-details.tsx          # Order detail screen view
│   └── transaction-details.tsx    # Transaction detail screen view
└── components/
    ├── detail/                     # Shared detail components
    │   ├── DetailSection.tsx       # Reusable card container
    │   ├── DetailRow.tsx          # Key-value pair display
    │   ├── StatusBadge.tsx        # Colored status indicators
    │   └── AmountDisplay.tsx      # Formatted amount with currency and status
    ├── order-detail/
    │   ├── OrderSummaryCard.tsx   # Main order info with amount and status
    │   ├── CardPaymentDetails.tsx # Card payment details (if available)
    │   ├── CustomerInfoCard.tsx   # Customer details (conditional)
    │   └── AdditionalInfoCard.tsx # Metadata and origin info
    └── transaction-detail/
        ├── TransactionSummaryCard.tsx    # Transaction info with amounts
        ├── TransactionMethodCard.tsx     # Payment method and card details
        ├── TransactionCustomerCard.tsx   # Customer information
        └── TransactionAdditionalCard.tsx # Order references, labels, flags
```

#### Detail APIs

**Order Detail:**
- Endpoint: `GET /v3/payment/sessions/{sessionId}/payment`
- Model: `OrderDetailPayment`, `FetchOrderDetailResponse`
- Returns: Complete order data including `sourceOfFunds`, `history`, `metaData`, `fees`, `vat`, etc.

**Transaction Detail:**
- Endpoint: `GET /v2/aggregator/transactions/{transactionId}`
- Model: `TransactionDetail`, `FetchTransactionDetailResponse`
- Returns: Complete transaction data with `sourceOfFunds`, `order`, `transactions`, etc.

#### Data Models - Shared Interfaces

To avoid duplication, the following interfaces are shared between Order and Transaction:

**`SourceOfFunds`** - Card payment information:
```typescript
interface SourceOfFunds {
    maskedCard?: string;
    extendedMaskedCard?: string;
    cardBrand?: string;
    cardHolderName?: string;
    cardDataToken?: string;
    ccvToken?: string;
    expiryYear?: string;
    expiryMonth?: string;
    storedOnFile?: string;
    save?: boolean;
    issuer?: string;
    agreement?: string | null;
}
```

**`SharedMetaData`** - Origin and tracking information:
```typescript
interface SharedMetaData {
    kashierOriginType?: string;
    kashierOriginDetails?: {
        id?: string;
        customerName?: string;
        customerEmail?: string;
        customerPhone?: string;
    };
    'kashier payment UI version'?: string;
    'referral url'?: string;
    termsAndConditions?: {
        ip?: string;
    };
}
```

**`TransactionResponseMessage`** - Bilingual response messages:
```typescript
interface TransactionResponseMessage {
    en: string;
    ar: string;
}
```

#### OrderDetailPayment Interface

Complete order detail model matching web version display:

```typescript
interface OrderDetailPayment {
    sessionId: string;
    status: SessionStatus;
    createdAt: string;
    updatedAt: string;
    merchantId: string;
    merchantOrderId: string;
    amount: number;
    currency: string;
    method?: string;              // "card", "wallet", etc.
    pcc: OrderDetailPCC;
    provider?: string;            // "mpgs", etc.
    acquirer?: string;            // "nbe", etc.
    orderId: string;              // Kashier order ID
    capturedAmount: number;
    refundedAmount: number;
    paymentChannel: string;       // "ONLINE", "POS"
    rfsDate?: string;
    lastTransactionType?: string; // "pay", "refund", etc.
    issuerAuthorizationCode?: string;
    merchantType?: string;        // "pf", etc.
    metaData?: SharedMetaData;
    fees?: string;
    vat?: string;
    settlementAmount?: string;
    sourceOfFunds?: SourceOfFunds; // Card details
    posTerminal?: OrderDetailPosTerminal;
    targetTransactionId?: string;
    history?: OrderDetailHistoryItem[]; // Transaction history
}
```

#### ViewModels Pattern

Both detail viewmodels use React Query's `useQuery`:

```typescript
export const useOrderDetailVM = (sessionId: string) => {
    const { api } = useApi();

    const orderDetailQuery = useQuery<FetchOrderDetailResponse>({
        queryKey: ['payment-order-detail', sessionId],
        queryFn: () => fetchOrderDetail(api, sessionId),
        enabled: !!sessionId,
        staleTime: 5 * 60 * 1000,
    });

    return {
        ...orderDetailQuery,
        order: orderDetailQuery.data?.data,
    };
};
```

#### Navigation

- **Order Details**: Tap `OrderCard` → `/payments/{_id}` → `order-details.tsx`
- **Transaction Details**: Tap `TransactionCard` → `/payments/transaction/{transactionId}` → `transaction-details.tsx`
- Long press opens `ActionsModal` (already implemented in list view)

#### Web Version Parity

The mobile detail screens display the same information as the web version:

**Main Summary:**
- Amount + Currency
- Status badge with color coding
- Order ID / Transaction ID

**Order Details Section:**
- Merchant order ID
- Kashier order ID
- Payment Method
- Last Update
- Channel
- Last transaction type
- Origin
- Merchant Type

**Card Payment Details Section** (if `sourceOfFunds` available):
- Card holder Name
- Card Type (brand)
- Masked Card number
- Expiry Date (formatted as "MM / YY")

**Metadata Section:**
- kashierOriginType
- kashierOriginDetails (id, customerName)
- kashier payment UI version
- referral url
- termsAndConditions.ip

#### Important Implementation Notes

1. **Route Pattern:**
   - Route files (`app/payments/[_id].tsx`) are thin wrappers that import from view files
   - Actual implementation in `src/modules/payments/views/{order|transaction}-details.tsx`
   - Follows established pattern from balance and payment-links modules

2. **Shared Components:**
   - Use `MainHeader` for header (not Stack.Screen options)
   - Use `SimpleLoader` for loading state
   - Use `FaildToLoad` for error state with retry functionality
   - Use `SafeAreaView` for proper safe area handling

3. **AmountDisplay Component:**
   - Custom component that shows amount, currency, status badge, and order ID
   - Includes icon box with up/down arrow based on payment status
   - Integrated with StatusBox component for consistent status display

4. **Conditional Rendering:**
   - All detail cards check if data exists before rendering
   - Card Payment Details only shows if `sourceOfFunds` is available
   - Customer Info only shows if customer data exists in `metaData.kashierOriginDetails`
   - Metadata section displays nested objects properly

5. **Data Access Patterns:**
   - Order detail: All data in single response from `/v3/payment/sessions/{id}/payment`
   - No need for separate transaction fetch - `history` array contains transaction timeline
   - Use optional chaining (`?.`) for nested data access
   - Filter out "NA" values when displaying

6. **Localization:**
   - All field labels support English/Arabic
   - Status badges adapt to RTL layout
   - Date formatting uses `formatAMPM()` utility
   - Amount formatting uses `currencyNumber()` utility

### Multiple Payment Method Support

The order detail screen supports displaying payment information for 4 different payment types with appropriate UI components.

#### Supported Payment Types

**1. Card Payments:**
- Fields: `maskedCard`, `cardBrand`, `cardHolderName`, `expiryMonth`, `expiryYear`, `issuer`
- Component: `CardPaymentDetails.tsx`
- Displays: Card brand icon, issuer logo, masked card number, holder name, expiry date

**2. VALU Payments (Installment):**
- Fields: `payerInfo` with `mobileNumber`, `loanNumber`, `emi`, `tenure`, `financedAmount`, etc.
- Component: `ValuPaymentDetails.tsx`
- Displays: Mobile number, loan number, financed amount, EMI, tenure, installment dates

**3. Wallet Payments (Vodafone Cash, Orange Cash, etc.):**
- Fields: `payerAccount`, `payScheme`, `paidThrough`, `walletStrategy`
- Component: `WalletPaymentDetails.tsx`
- Displays: Phone number, payment scheme, wallet provider name

**4. Cash Payments:**
- Fields: `type: "Cash"`
- Component: `CashPaymentDetails.tsx`
- Displays: Payment type indicator

#### Updated SourceOfFunds Model

```typescript
// VALU Payment Info
interface ValuPayerInfo {
    mobileNumber?: string;
    loanNumber?: string;
    emi?: number;
    tenure?: number;
    financedAmount?: number;
    firstEmiDueDate?: string;
    lastInstallmentDate?: string;
    valuTransactionId?: string;
    // ... other VALU fields
}

// Unified SourceOfFunds interface supporting all payment types
interface SourceOfFunds {
    // Card Payment fields
    maskedCard?: string;
    cardBrand?: string;
    cardHolderName?: string;
    expiryYear?: string;
    expiryMonth?: string;
    issuer?: string;

    // VALU Payment fields
    payerInfo?: ValuPayerInfo;

    // Wallet Payment fields
    payerAccount?: string;
    payScheme?: string;
    paidThrough?: string;
    walletStrategy?: string;

    // Type discriminator
    type?: string; // "VALU", "Cash", etc.
}
```

#### Type Guards (payments.utils.ts)

```typescript
export const isCardPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    return !!(sourceOfFunds?.maskedCard || sourceOfFunds?.cardBrand);
};

export const isValuPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    return sourceOfFunds?.type === 'VALU' || !!sourceOfFunds?.payerInfo;
};

export const isWalletPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    return !!(sourceOfFunds?.payerAccount && sourceOfFunds?.payScheme);
};

export const isCashPayment = (sourceOfFunds?: SourceOfFunds): boolean => {
    return sourceOfFunds?.type === 'Cash';
};
```

#### PaymentMethodDetails Wrapper

Smart wrapper component that automatically detects payment type and renders the appropriate component:

```typescript
// src/modules/payments/components/order-detail/PaymentMethodDetails.tsx
export const PaymentMethodDetails = ({ sourceOfFunds }: Props) => {
    if (!sourceOfFunds) return null;

    if (isValuPayment(sourceOfFunds)) return <ValuPaymentDetails sourceOfFunds={sourceOfFunds} />;
    if (isCashPayment(sourceOfFunds)) return <CashPaymentDetails sourceOfFunds={sourceOfFunds} />;
    if (isWalletPayment(sourceOfFunds)) return <WalletPaymentDetails sourceOfFunds={sourceOfFunds} />;
    if (isCardPayment(sourceOfFunds)) return <CardPaymentDetails sourceOfFunds={sourceOfFunds} />;

    return null;
};
```

Usage in `OrderSummaryCard`:
```typescript
<PaymentMethodDetails sourceOfFunds={order.sourceOfFunds} />
```

#### Key Features

- **Defensive Programming**: All components use optional chaining for safe property access
- **Graceful Degradation**: Missing fields don't break the UI
- **Type Safety**: TypeScript type guards ensure correct type detection
- **Extensibility**: Easy to add new payment types without refactoring
- **Consistent Design**: All payment detail components use the same card-style UI
- **No Breaking Changes**: Existing implementations continue to work

### Detail Screens Tabbed Interface

Both order and transaction detail screens use a unified tabbed interface with sticky tab behavior for better UX.

#### Tab Structure

```
src/modules/payments/
├── payments.model.ts  # OrderDetailsTabType & TransactionDetailsTabType = 'details' | 'settlement' | 'history'
├── components/
│   └── detail/
│       ├── DetailsTabs.tsx        # Generic tab switcher (supports both order and transaction)
│       ├── details-tabs/          # Order-specific tab content
│       │   ├── DetailsTab.tsx     # Order details
│       │   ├── SettlementTab.tsx  # Settlement wrapper with adapter
│       │   └── HistoryTab.tsx     # Order history
│       ├── transaction-tabs/      # Transaction-specific tab content
│       │   ├── DetailsTab.tsx     # Transaction details
│       │   ├── SettlementTab.tsx  # Settlement wrapper with adapter
│       │   └── HistoryTab.tsx     # Transaction history
│       └── settlement/            # Shared settlement components
│           ├── adapters.ts        # Data normalization adapters
│           ├── CashSettlementDetails.tsx
│           ├── ValuSettlementDetails.tsx
│           ├── WalletSettlementDetails.tsx
│           └── index.ts
└── views/
    ├── order-details.tsx          # Order screen with sticky tabs
    └── transaction-details.tsx    # Transaction screen with sticky tabs
```

#### Sticky Tabs Implementation

The tabs become sticky (fixed at top) when scrolling:

```typescript
const [activeTab, setActiveTab] = useState<OrderDetailsTabType>('details');
const [isTabsSticky, setIsTabsSticky] = useState(false);
const [summaryHeight, setSummaryHeight] = useState(0);

const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsTabsSticky(scrollY > summaryHeight - 10);
};
```

**Features:**
- Tabs fixed at top when scrolling past OrderSummaryCard
- Smooth transition with shadow/elevation when sticky
- Content scrolls independently below sticky tabs
- Tab state preserved during scrolling
- Performance optimized with `scrollEventThrottle={16}`

#### Tab Components

**DetailsTabs (Generic Component):**
- Consolidated tabs component using TypeScript generics
- Works for both `OrderDetailsTabType` and `TransactionDetailsTabType`
- Three tabs: Details, Settlement, History
- Supports i18n translations
- Eliminates code duplication between order and transaction detail screens

**Usage:**
```typescript
// For Orders
<DetailsTabs<OrderDetailsTabType> value={activeTab} onSelectType={setActiveTab} />
{activeTab === 'details' && <DetailsTab order={order} />}
{activeTab === 'settlement' && <SettlementTab order={order} />}
{activeTab === 'history' && <HistoryTab order={order} />}

// For Transactions (same component!)
<DetailsTabs<TransactionDetailsTabType> value={activeTab} onSelectType={setActiveTab} />
{activeTab === 'details' && <DetailsTab transaction={transaction} />}
{activeTab === 'settlement' && <SettlementTab transaction={transaction} />}
{activeTab === 'history' && <HistoryTab transaction={transaction} />}
```

### Settlement Tab Implementation

The Settlement tab displays payment-specific settlement information with shared components for both orders and transactions using an adapter pattern.

#### Settlement Architecture

The settlement system uses:
1. **Adapter Pattern**: Normalizes order and transaction data into a common `SettlementData` interface
2. **Shared Components**: Same settlement components work for both orders and transactions
3. **Smart Wrappers**: Tab-specific wrappers handle data adaptation and component selection

#### Settlement Structure

```
src/modules/payments/components/detail/
├── settlement/
│   ├── adapters.ts                  # Data normalization layer
│   ├── CashSettlementDetails.tsx    # Basic financial summary
│   ├── ValuSettlementDetails.tsx    # VALU installment information
│   ├── WalletSettlementDetails.tsx  # Wallet payment information
│   └── index.ts                     # Clean exports
├── details-tabs/
│   └── SettlementTab.tsx            # Order wrapper with adaptOrderData()
└── transaction-tabs/
    └── SettlementTab.tsx            # Transaction wrapper with adaptTransactionData()
```

#### Adapter Pattern

**SettlementData Interface:**
```typescript
export interface SettlementData {
    amount: number;
    capturedAmount: number;
    refundedAmount: number;
    fees?: string | number;
    vat?: string | number;
    settlementAmount?: string;
    sourceOfFunds?: SourceOfFunds;
}
```

**Data Adapters:**
```typescript
// Normalizes OrderDetailPayment to SettlementData
export const adaptOrderData = (order: OrderDetailPayment): SettlementData => ({
    amount: order.amount,
    capturedAmount: order.capturedAmount,
    refundedAmount: order.refundedAmount,
    fees: order.fees,
    vat: order.vat,
    settlementAmount: order.settlementAmount,
    sourceOfFunds: order.sourceOfFunds,
});

// Normalizes TransactionDetail to SettlementData
export const adaptTransactionData = (transaction: TransactionDetail): SettlementData => ({
    amount: transaction.amount,
    capturedAmount: transaction.totalCapturedAmount,
    refundedAmount: transaction.totalRefundedAmount,
    fees: transaction.order?.feeTrxAmount,
    vat: transaction.order?.feeVatAmount,
    settlementAmount: undefined, // Transactions don't have settlementAmount
    sourceOfFunds: transaction.sourceOfFunds,
});
```

#### Settlement Components

**SettlementTab Wrappers (Smart Components):**
- Use type guards (`isValuPayment`, `isWalletPayment`, `isCashPayment`) to detect payment type
- Automatically render the appropriate settlement detail component
- Adapt data using `adaptOrderData()` or `adaptTransactionData()`
- Fall back to `CashSettlementDetails` for unknown payment types
- Identical logic in both `details-tabs/SettlementTab.tsx` and `transaction-tabs/SettlementTab.tsx`

**Example (works for both orders and transactions):**
```typescript
const SettlementTab = ({ order }: Props) => {
    const sourceOfFunds = order.sourceOfFunds;
    const settlementData = adaptOrderData(order); // or adaptTransactionData(transaction)

    if (isValuPayment(sourceOfFunds)) {
        return <ValuSettlementDetails data={settlementData} />;
    }
    if (isWalletPayment(sourceOfFunds)) {
        return <WalletSettlementDetails data={settlementData} />;
    }
    if (isCashPayment(sourceOfFunds)) {
        return <CashSettlementDetails data={settlementData} />;
    }
    return <CashSettlementDetails data={settlementData} />; // Fallback
}
```

**ValuSettlementDetails:**
Displays VALU installment payment information:
- Customer information: Mobile number, loan number, customer name, national ID
- Installment details: Tenure, monthly payment (EMI), first/last installment dates
- Financial breakdown: Financed amount, admin fees, down payment, cashback, ToU amount
- Only renders if `sourceOfFunds.payerInfo` exists

**WalletSettlementDetails:**
Displays wallet payment information in two sections:
- Wallet Information: Mobile number, payment scheme, paid through, wallet strategy
- Financial Summary: Amount, captured amount, refunded amount (conditional), fees, settlement amount (conditional)
- Uses `capitalizeWords()` formatter for readable field values

**CashSettlementDetails:**
Displays basic financial summary (used for cash and card payments):
- Accepts normalized `SettlementData` interface
- Amount, captured amount, refunded amount (conditional)
- Fees, VAT, settlement amount (conditional)
- Minimal UI, focused on core transaction amounts
- Works for both orders and transactions via adapter

#### Formatting Utilities

New utility file: `src/modules/payments/utils/formatters.ts`

```typescript
// Formats monetary amounts with EGP currency
export const formatAmount = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined || value === 0) return "0 EGP";
    return `${value} EGP`;
};

// Formats text fields with fallback
export const formatText = (value: string | null | undefined): string => {
    return value || "--";
};

// Converts camelCase to Title Case
export const capitalizeWords = (value: string | null | undefined): string => {
    if (!value) return "--";
    return value
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
```

**Usage:**
- `formatAmount(100)` → "100 EGP"
- `formatAmount(null)` → "0 EGP"
- `formatText(null)` → "--"
- `capitalizeWords("vodafoneCash")` → "Vodafone Cash"

#### Key Features

- **Adapter Pattern**: Normalizes different data structures into a common interface
- **Component Reusability**: Same settlement components work for orders and transactions
- **Payment Type Detection**: Automatic component selection based on payment method
- **Defensive Coding**: All components handle null/undefined data gracefully
- **Conditional Rendering**: Fields like `refundedAmount` only show when > 0
- **Consistent Formatting**: Shared formatters ensure uniform display across all settlement components
- **Type Safety**: All components properly typed with normalized `SettlementData` interface
- **Zero Code Duplication**: No need for separate order and transaction settlement components
- **Extensibility**: Easy to add new payment types by creating one new component

### History Tab Implementation

The History tab displays a complete timeline of all order events and transactions with contextual icons and descriptions.

#### History Data Structure

```typescript
interface OrderDetailHistoryItem {
    orderId?: string;
    method?: string;              // "valu", "wallet", "card", "cash"
    provider?: string;            // "vodafone", "valu", etc.
    status: string;               // "SUCCESS", "FAILURE", "OPENED", etc.
    date: string;
    transactionId?: string;
    operation?: string;           // "pay", "refund", "verify_customer", etc.
    amount?: number;
    transactionResponseCode?: string;
    transactionResponseMessage?: TransactionResponseMessage;
    sourceOfFunds?: SourceOfFunds;
}
```

#### History Card Display

Each history item shows:
- **Date**: Full date with relative date and time (e.g., "13 Nov 2025 • Yesterday 11:34 AM")
- **Transaction ID**: Displayed inline with date when available
- **Icon**: Contextual icon based on operation/status/payment method
- **Description**: User-friendly message matching web version

#### Icon System

Icons are determined by priority:

1. **Refund Operations** → Refund settlement icon (gray background)
2. **Main Payment Success** (`pay` + `SUCCESS`) → Green checkmark icon
3. **Failure Status** → Red X mark icon
4. **Payment Method Icons** (all other operations) → Settlement icons:
   - Valu → `<ValuSettlementIcon />`
   - Aman → `<AmanSettlementIcon />`
   - Basata → `<BasataSettlementIcon />`
   - Souhoola → `<SouhoolaSettlementIcon />`
   - Contact → `<ContactSettlementIcon />`
5. **Generic Status** (no payment method) → Banknotes or shield icons

#### Description Messages

Matches web version phrasing:

**VALU Operations:**
- `pay`: "Successful payment with Valu"
- `verify_customer`: "Valu client was successfuly verified using 01096909624"
- `inquiry`: "Customer choose installment plan successfully 01096909624"
- `initiate_valu`: "Succeeded getting Valu Customer Information using 01096909624"

**Wallet Operations:**
- `initiate_r2p` (success): "Vodafone Cash payment initiated"
- `initiate_r2p` (failure): "Failed to send R2P to wallet 01018644489 [error message]"
- `payment_key_request`: "Order keys verified successfully"
- `order_register`: "Order registered successfully"
- `merchant_login`: "Vodafone Cash service initiated successfully"

**Refund Operations:**
- `refund`: "Successfully refunded 40 EGP due to customer request. It may take a few days for the money to reach the customer"

**Status Changes:**
- `CREATED`: "Session created"
- `OPENED`: "Payment Intent"
- `PENDING`: "New payment started"
- `EXPIRED`: "Session expired"

#### Implementation Details

```typescript
// Extract phone number from various sources
const getPhoneNumber = (item: OrderDetailHistoryItem): string | null => {
    return item.sourceOfFunds?.payerInfo?.mobileNumber
        || item.sourceOfFunds?.payerAccount
        || null;
};

// Get user-friendly payment method name
const getPaymentMethodName = (item: OrderDetailHistoryItem): string => {
    if (item.method === 'valu') return 'Valu';
    if (item.method === 'wallet') {
        if (item.provider === 'vodafone') return 'Vodafone Cash';
        // ... other wallet providers
    }
    // ... other payment methods
};

// Format date with full details
const formatHistoryDate = (dateInput: string): string => {
    const date = new Date(dateInput);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const relativeDate = formatRelativeDate(dateInput, false);
    const time = formatAMPM(dateInput);

    return `${day} ${month} ${year} • ${relativeDate} ${time}`;
};
```

#### Key Features

- **Complete Timeline**: Shows all events from session creation to final status
- **Bilingual Support**: Uses `transactionResponseMessage` for error messages in English/Arabic
- **Contextual Icons**: Different icons for different payment methods and operations
- **Detailed Information**: Includes amounts, phone numbers, and transaction IDs
- **Defensive Coding**: Handles missing/null data gracefully
- **Web Parity**: Matches web version descriptions and formatting

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

## Actions Modal Pattern

Feature modules can implement bottom sheet action modals for quick actions on list items (similar to payment-links).

### Implementation Pattern

**For Payments Module:**
- Long press on OrderCard or TransactionCard opens ActionsModal
- Regular tap navigates to details screen using Link with `asChild` prop
- Modal shows payment/transaction summary with action buttons

**Structure:**
```
src/modules/payments/components/modals/ActionsModal/
├── ActionsModal.tsx    # Main modal component
├── ActionItem.tsx      # Reusable action button
└── index.tsx          # Export file
```

**Usage Example:**
```typescript
// In OrderCard.tsx
<Link href={`/payments/${_id}`} asChild>
    <Pressable onLongPress={() => onOpenActions?.(payment)}>
        {/* Card content */}
    </Pressable>
</Link>

// In list view
const [selectedPayment, setSelectedPayment] = useState<PaymentSession | Transaction | null>(null);

<AnimatePresence>
    {selectedPayment && (
        <ActionsModal
            isVisible={!!selectedPayment}
            onClose={() => setSelectedPayment(null)}
            payment={selectedPayment}
            type={isOrdersTab ? "order" : "transaction"}
        />
    )}
</AnimatePresence>
```

**Key Features:**
- Type guards for handling different data types (orders vs transactions)
- Computed values instead of getter functions for performance
- Comprehensive null/undefined safety checks
- Moti animations for smooth slide-up effect

## Scroll-to-Top Pattern

All tabbed list screens automatically scroll to top when switching tabs for better UX.

### Implementation

1. **Update StickyHeaderList** to support `forwardRef`:
```typescript
// src/shared/components/StickyHeaderList/StickyHeaderList.tsx
const StickyHeaderList = forwardRef(StickyHeaderListComponent);
```

2. **In feature list views**:
```typescript
// Create ref
const listRef = useRef<React.ComponentRef<typeof FlashList<GroupedRow<T>>>>(null);

// Watch for tab changes
useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
}, [tabState]);

// Pass ref to list
<StickyHeaderList ref={listRef} ... />
```

**Applied to:**
- Payments module: Orders ↔ Transactions tabs
- Payment-Links module: All/Paid/Unpaid/etc. tabs
- Balance module: Payout/Transfer/All tabs

## Debugging Utilities

### Logger Utility
Use the logger utility for formatted console output instead of plain `console.log`:

```typescript
// src/core/utils/logger.ts
export const logJSON = (label: string, data: any) => {
    console.log(`${label}:`, JSON.stringify(data, null, 2));
};

// Usage
import { logJSON } from '@/src/core/utils/logger';
logJSON('Payment Data', payment);
```

Benefits:
- Formatted JSON output with proper indentation
- Easy to read nested objects
- Consistent logging pattern across codebase

## Common Gotchas

- Language changes that affect RTL require full app reload (`expo-updates`)
- Environment/mode changes affect API base URLs - ensure correct environment is set
- Some native modules require development builds, cannot use Expo Go
- SVG imports require `react-native-svg-transformer` configuration in `metro.config.js`
- dont over engineering only best practice and prevent unnecessary re renders without over using usecallbacks or usememo
- try to dont break any thing that arleady works while you fix an issue or add new feature this is a production grade app
- When implementing filters with multiple tabs/views, maintain separate filter states to avoid param name conflicts
- Always check if similar UI patterns already exist as shared components before creating new ones
- When components need to work with multiple data types, prefer TypeScript generics or the adapter pattern over code duplication
- When refactoring for reusability, consolidate duplicate components into shared implementations (e.g., `DetailsTabs` replaced separate `OrderDetailsTabs` and `TransactionDetailsTabs`)