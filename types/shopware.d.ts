// Shopware 6 API Types for Customer Authentication & Cart

// ============================================
// Base Types
// ============================================

interface ShopwareMedia {
  id: string
  url: string
  thumbnails?: Array<{
    url: string
    width: number
    height: number
  }>
}

interface ShopwareSalutation {
  id: string
  salutationKey: string
  displayName: string
  letterName: string
}

interface ShopwareCountry {
  id: string
  name: string
  iso: string
  iso3: string
  active: boolean
  states?: ShopwareCountryState[]
}

interface ShopwareCountryState {
  id: string
  name: string
  shortCode: string
  countryId: string
}

// ============================================
// Address Types
// ============================================

interface ShopwareAddress {
  id: string
  customerId: string
  countryId: string
  countryStateId?: string
  salutationId: string
  firstName: string
  lastName: string
  street: string
  zipcode: string
  city: string
  company?: string
  department?: string
  phoneNumber?: string
  additionalAddressLine1?: string
  additionalAddressLine2?: string
  country?: ShopwareCountry
  countryState?: ShopwareCountryState
  salutation?: ShopwareSalutation
}

interface ShopwareAddressInput {
  salutationId: string
  firstName: string
  lastName: string
  street: string
  zipcode: string
  city: string
  countryId: string
  countryStateId?: string
  company?: string
  department?: string
  phoneNumber?: string
  additionalAddressLine1?: string
  additionalAddressLine2?: string
}

// ============================================
// Customer Types
// ============================================

interface ShopwareCustomer {
  id: string
  email: string
  firstName: string
  lastName: string
  salutationId: string
  salutation?: ShopwareSalutation
  title?: string
  company?: string
  guest: boolean
  active: boolean
  doubleOptInRegistration: boolean
  doubleOptInEmailSentDate?: string
  doubleOptInConfirmDate?: string
  birthday?: string
  defaultBillingAddressId: string
  defaultShippingAddressId: string
  defaultBillingAddress?: ShopwareAddress
  defaultShippingAddress?: ShopwareAddress
  addresses?: ShopwareAddress[]
  createdAt: string
  updatedAt?: string
}

// ============================================
// Auth Request Types
// ============================================

interface ShopwareLoginRequest {
  email: string
  password: string
}

interface ShopwareRegisterRequest {
  email: string
  password: string
  salutationId: string
  firstName: string
  lastName: string
  storefrontUrl: string
  acceptedDataProtection: boolean
  billingAddress: ShopwareAddressInput
  shippingAddress?: ShopwareAddressInput
}

interface RegistrationFormData {
  email: string
  password: string
  passwordConfirm: string
  salutationId: string
  firstName: string
  lastName: string
  street: string
  zipcode: string
  city: string
  countryId: string
  countryStateId?: string
  phoneNumber?: string
  company?: string
  acceptTerms: boolean
}

// ============================================
// Cart Types
// ============================================

interface ShopwarePrice {
  unitPrice: number
  quantity: number
  totalPrice: number
  calculatedTaxes: Array<{
    tax: number
    taxRate: number
    price: number
  }>
  taxRules: Array<{
    taxRate: number
    percentage: number
  }>
  referencePrice?: {
    price: number
    purchaseUnit: number
    referenceUnit: number
    unitName: string
  }
  listPrice?: {
    price: number
    discount: number
    percentage: number
  }
}

interface ShopwareCartLineItem {
  id: string
  referencedId: string
  label: string
  quantity: number
  type: string
  good: boolean
  description?: string
  cover?: ShopwareMedia
  price: ShopwarePrice
  payload?: {
    productNumber?: string
    options?: Array<{
      group: string
      option: string
    }>
  }
  states?: string[]
}

interface ShopwareCartDelivery {
  deliveryDate: {
    earliest: string
    latest: string
  }
  shippingMethod: ShopwareShippingMethod
  location: {
    country: ShopwareCountry
    state?: ShopwareCountryState
    address: ShopwareAddress
  }
  shippingCosts: ShopwarePrice
  positions: Array<{
    identifier: string
    quantity: number
    price: ShopwarePrice
  }>
}

interface ShopwareCartTransaction {
  paymentMethodId: string
  amount: ShopwarePrice
}

interface ShopwareCart {
  token: string
  name: string
  price: {
    netPrice: number
    totalPrice: number
    calculatedTaxes: Array<{
      tax: number
      taxRate: number
      price: number
    }>
    taxRules: Array<{
      taxRate: number
      percentage: number
    }>
    positionPrice: number
    taxStatus: string
  }
  lineItems: ShopwareCartLineItem[]
  errors: Array<{
    id: string
    message: string
    code: number
    level: number
  }>
  deliveries: ShopwareCartDelivery[]
  transactions: ShopwareCartTransaction[]
  modified: boolean
  customerComment?: string
  affiliateCode?: string
  campaignCode?: string
}

// ============================================
// Shipping & Payment Types
// ============================================

interface ShopwareShippingMethod {
  id: string
  name: string
  description?: string
  deliveryTime?: {
    name: string
    min: number
    max: number
    unit: string
  }
  active: boolean
  media?: ShopwareMedia
  prices?: Array<{
    currencyId: string
    price: number
  }>
}

interface ShopwarePaymentMethod {
  id: string
  name: string
  description?: string
  active: boolean
  afterOrderEnabled: boolean
  media?: ShopwareMedia
  synchronous: boolean
  asynchronous: boolean
  prepared: boolean
  refundable: boolean
}

// ============================================
// Order Types
// ============================================

interface ShopwareOrderLineItem {
  id: string
  productId?: string
  referencedId?: string
  label: string
  quantity: number
  unitPrice: number
  totalPrice: number
  type: string
  cover?: ShopwareMedia
  payload?: {
    productNumber?: string
  }
}

interface ShopwareOrderDelivery {
  id: string
  shippingMethodId: string
  shippingOrderAddress: ShopwareAddress
  shippingMethod?: {
    id: string
    name: string
    description?: string
  }
  shippingCosts: {
    totalPrice: number
    unitPrice: number
    quantity: number
  }
  trackingCodes?: string[]
}

interface ShopwareOrderTransaction {
  id: string
  paymentMethodId: string
  amount: {
    totalPrice: number
    unitPrice: number
    quantity: number
  }
  paymentMethod?: {
    id: string
    name: string
    description?: string
  }
  stateMachineState?: {
    id: string
    technicalName: string
    name: string
  }
}

interface ShopwareStateMachineState {
  id: string
  technicalName: string
  name: string
}

interface ShopwareOrder {
  id: string
  orderNumber: string
  orderDateTime: string
  amountTotal: number
  amountNet: number
  shippingTotal: number
  currencyId: string
  currency?: {
    id: string
    isoCode: string
    symbol: string
  }
  stateMachineState?: ShopwareStateMachineState
  lineItems?: ShopwareOrderLineItem[]
  deliveries?: ShopwareOrderDelivery[]
  transactions?: ShopwareOrderTransaction[]
  billingAddress?: ShopwareAddress
  orderCustomer?: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
  createdAt: string
  updatedAt?: string
}

interface ShopwareOrderResponse {
  elements: ShopwareOrder[]
  total: number
  page?: number
  limit?: number
}

// ============================================
// Checkout Types
// ============================================

interface CheckoutFormData {
  email: string
  firstName: string
  lastName: string
  street: string
  zipcode: string
  city: string
  countryId: string
  countryStateId?: string
  salutationId: string
  phoneNumber?: string
  company?: string
}

interface PlaceOrderResponse {
  id: string
  orderNumber: string
  orderDateTime: string
  amountTotal: number
  amountNet: number
  shippingTotal: number
  lineItems: ShopwareOrderLineItem[]
  billingAddress: ShopwareAddress
  currency: {
    id: string
    isoCode: string
    symbol: string
  }
}

// ============================================
// API Response Types
// ============================================

interface ShopwareApiError {
  status: string
  code: string
  title: string
  detail: string
  source?: {
    pointer?: string
  }
}

interface ShopwareErrorResponse {
  errors: ShopwareApiError[]
}

// ============================================
// Auth State Types
// ============================================

interface AuthState {
  customer: ShopwareCustomer | null
  loading: boolean
  error: string | null
  isInitialized: boolean
}

// ============================================
// Form Types
// ============================================

interface LoginFormState {
  email: string
  password: string
  rememberMe: boolean
}

interface RegisterFormState extends RegistrationFormData {
  // Additional UI state
}

// ============================================
// Global Type Declarations
// ============================================

declare global {
  type Customer = ShopwareCustomer
  type Address = ShopwareAddress
  type AddressInput = ShopwareAddressInput
  type Order = ShopwareOrder
  type OrderLineItem = ShopwareOrderLineItem
  type Country = ShopwareCountry
  type CountryState = ShopwareCountryState
  type Salutation = ShopwareSalutation
  type Cart = ShopwareCart
  type CartLineItem = ShopwareCartLineItem
  type ShippingMethod = ShopwareShippingMethod
  type PaymentMethod = ShopwarePaymentMethod
}

export {
  ShopwareMedia,
  ShopwareSalutation,
  ShopwareCountry,
  ShopwareCountryState,
  ShopwareAddress,
  ShopwareAddressInput,
  ShopwareCustomer,
  ShopwareLoginRequest,
  ShopwareRegisterRequest,
  RegistrationFormData,
  ShopwarePrice,
  ShopwareCartLineItem,
  ShopwareCartDelivery,
  ShopwareCartTransaction,
  ShopwareCart,
  ShopwareShippingMethod,
  ShopwarePaymentMethod,
  ShopwareOrderLineItem,
  ShopwareOrderDelivery,
  ShopwareOrderTransaction,
  ShopwareStateMachineState,
  ShopwareOrder,
  ShopwareOrderResponse,
  CheckoutFormData,
  PlaceOrderResponse,
  ShopwareApiError,
  ShopwareErrorResponse,
  AuthState,
  LoginFormState,
  RegisterFormState
}
