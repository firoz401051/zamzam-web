import { 
  logEvent, 
  setUserProperties, 
  setUserId,
  setCurrentScreen,
  CustomParams 
} from 'firebase/analytics';
import { analytics, isAnalyticsAvailable } from './config';

// Analytics event types
export interface ProductViewEvent {
  item_id: string;
  item_name: string;
  item_category: string;
  price: number;
  currency: string;
}

export interface PurchaseEvent {
  transaction_id: string;
  value: number;
  currency: string;
  items: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    quantity: number;
    price: number;
  }>;
}

export interface AddToCartEvent {
  currency: string;
  value: number;
  items: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    quantity: number;
    price: number;
  }>;
}

export interface SearchEvent {
  search_term: string;
  results_count: number;
}

export interface UserSignUpEvent {
  method: string;
  user_type: 'customer' | 'employee';
}

export interface UserLoginEvent {
  method: string;
  user_type: 'customer' | 'employee';
}

// Core analytics class
class AnalyticsService {
  // Initialize user tracking
  setUser(userId: string, properties: Record<string, any> = {}) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      setUserId(analytics, userId);
      setUserProperties(analytics, {
        user_type: properties.userType || 'customer',
        employee_role: properties.employeeRole || null,
        registration_date: properties.registrationDate || new Date().toISOString(),
        ...properties
      });
    } catch (error) {
      console.error('Analytics setUser error:', error);
    }
  }

  // Track page views
  trackPageView(pageName: string, parameters: CustomParams = {}) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      setCurrentScreen(analytics, pageName);
      logEvent(analytics, 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: window.location.pathname,
        ...parameters
      });
    } catch (error) {
      console.error('Analytics trackPageView error:', error);
    }
  }

  // E-commerce tracking
  trackProductView(product: ProductViewEvent) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'view_item', {
        currency: product.currency,
        value: product.price,
        items: [{
          item_id: product.item_id,
          item_name: product.item_name,
          item_category: product.item_category,
          price: product.price,
          quantity: 1
        }]
      });
    } catch (error) {
      console.error('Analytics trackProductView error:', error);
    }
  }

  trackAddToCart(data: AddToCartEvent) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'add_to_cart', {
        currency: data.currency,
        value: data.value,
        items: data.items
      });
    } catch (error) {
      console.error('Analytics trackAddToCart error:', error);
    }
  }

  trackRemoveFromCart(data: AddToCartEvent) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'remove_from_cart', {
        currency: data.currency,
        value: data.value,
        items: data.items
      });
    } catch (error) {
      console.error('Analytics trackRemoveFromCart error:', error);
    }
  }

  trackBeginCheckout(data: AddToCartEvent) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'begin_checkout', {
        currency: data.currency,
        value: data.value,
        items: data.items
      });
    } catch (error) {
      console.error('Analytics trackBeginCheckout error:', error);
    }
  }

  trackPurchase(purchase: PurchaseEvent) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'purchase', {
        transaction_id: purchase.transaction_id,
        value: purchase.value,
        currency: purchase.currency,
        items: purchase.items
      });
    } catch (error) {
      console.error('Analytics trackPurchase error:', error);
    }
  }

  // User behavior tracking
  trackSearch(search: SearchEvent) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'search', {
        search_term: search.search_term,
        results_count: search.results_count
      });
    } catch (error) {
      console.error('Analytics trackSearch error:', error);
    }
  }

  trackUserSignUp(data: UserSignUpEvent) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'sign_up', {
        method: data.method,
        user_type: data.user_type
      });
    } catch (error) {
      console.error('Analytics trackUserSignUp error:', error);
    }
  }

  trackUserLogin(data: UserLoginEvent) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'login', {
        method: data.method,
        user_type: data.user_type
      });
    } catch (error) {
      console.error('Analytics trackUserLogin error:', error);
    }
  }

  // Business-specific events
  trackEmployeeAction(action: string, parameters: CustomParams = {}) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'employee_action', {
        action_type: action,
        timestamp: new Date().toISOString(),
        ...parameters
      });
    } catch (error) {
      console.error('Analytics trackEmployeeAction error:', error);
    }
  }

  trackOrderStatusChange(orderId: string, oldStatus: string, newStatus: string, employeeRole?: string) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'order_status_change', {
        order_id: orderId,
        old_status: oldStatus,
        new_status: newStatus,
        employee_role: employeeRole,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Analytics trackOrderStatusChange error:', error);
    }
  }

  trackAdminAction(action: string, resource: string, parameters: CustomParams = {}) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'admin_action', {
        action_type: action,
        resource_type: resource,
        timestamp: new Date().toISOString(),
        ...parameters
      });
    } catch (error) {
      console.error('Analytics trackAdminAction error:', error);
    }
  }

  // Performance tracking
  trackPerformanceMetric(metricName: string, value: number, unit: string = 'ms') {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'performance_metric', {
        metric_name: metricName,
        value: value,
        unit: unit,
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Analytics trackPerformanceMetric error:', error);
    }
  }

  // Error tracking
  trackError(error: Error, context: string = '') {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'exception', {
        description: error.message,
        fatal: false,
        context: context,
        stack: error.stack?.substring(0, 500), // Limit stack trace length
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    } catch (analyticsError) {
      console.error('Analytics trackError error:', analyticsError);
    }
  }

  // Conversion funnel tracking
  trackFunnelStep(funnelName: string, step: number, stepName: string, parameters: CustomParams = {}) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, 'funnel_step', {
        funnel_name: funnelName,
        step_number: step,
        step_name: stepName,
        timestamp: new Date().toISOString(),
        ...parameters
      });
    } catch (error) {
      console.error('Analytics trackFunnelStep error:', error);
    }
  }

  // Custom event tracking
  trackCustomEvent(eventName: string, parameters: CustomParams = {}) {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      logEvent(analytics, eventName, {
        timestamp: new Date().toISOString(),
        ...parameters
      });
    } catch (error) {
      console.error('Analytics trackCustomEvent error:', error);
    }
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

// Convenience functions for common events
export const trackPageView = (pageName: string, parameters?: CustomParams) => 
  analyticsService.trackPageView(pageName, parameters);

export const trackProductView = (product: ProductViewEvent) => 
  analyticsService.trackProductView(product);

export const trackAddToCart = (data: AddToCartEvent) => 
  analyticsService.trackAddToCart(data);

export const trackPurchase = (purchase: PurchaseEvent) => 
  analyticsService.trackPurchase(purchase);

export const trackSearch = (search: SearchEvent) => 
  analyticsService.trackSearch(search);

export const trackUserSignUp = (data: UserSignUpEvent) => 
  analyticsService.trackUserSignUp(data);

export const trackUserLogin = (data: UserLoginEvent) => 
  analyticsService.trackUserLogin(data);

export const trackError = (error: Error, context?: string) => 
  analyticsService.trackError(error, context);

export default analyticsService;