// Firebase configuration
export { app, analytics, firestore, isAnalyticsAvailable } from './config';

// Analytics service and types
export {
  default as analyticsService,
  trackPageView,
  trackProductView,
  trackAddToCart,
  trackPurchase,
  trackSearch,
  trackUserSignUp,
  trackUserLogin,
  trackError,
  type ProductViewEvent,
  type PurchaseEvent,
  type AddToCartEvent,
  type SearchEvent,
  type UserSignUpEvent,
  type UserLoginEvent,
} from './analytics';

// React hooks
export {
  useAnalytics,
  usePerformanceTracking,
  useEcommerceTracking,
} from './hooks';