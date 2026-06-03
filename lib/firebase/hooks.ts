import { useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import analyticsService, {
  trackPageView,
  trackProductView,
  trackAddToCart,
  trackPurchase,
  trackSearch,
  trackUserLogin,
  trackError,
  type ProductViewEvent,
  type AddToCartEvent,
  type PurchaseEvent,
  type SearchEvent,
  type UserLoginEvent,
} from './analytics';

// Custom hook for analytics
export const useAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  // Initialize user tracking when user loads
  useEffect(() => {
    if (isLoaded && user) {
      const userProperties = {
        userType: user.publicMetadata?.isEmployee ? 'employee' : 'customer',
        employeeRole: user.publicMetadata?.employeeRole || null,
        registrationDate: user.createdAt,
        email: user.emailAddresses[0]?.emailAddress,
      };

      analyticsService.setUser(user.id, userProperties);

      // Track login
      trackUserLogin({
        method: 'clerk',
        user_type: userProperties.userType as 'employee' | 'customer'
      });
    }
  }, [isLoaded, user]);

  // Track page views
  useEffect(() => {
    if (pathname) {
      const pageName = getPageName(pathname);
      const params = Object.fromEntries(searchParams.entries());
      
      trackPageView(pageName, {
        search_params: Object.keys(params).length > 0 ? JSON.stringify(params) : undefined,
        user_id: user?.id || null,
        user_type: user?.publicMetadata?.isEmployee ? 'employee' : 'customer',
      });
    }
  }, [pathname, searchParams, user]);

  // Track product view
  const trackProduct = useCallback((product: ProductViewEvent) => {
    trackProductView(product);
  }, []);

  // Track add to cart
  const trackCart = useCallback((data: AddToCartEvent) => {
    trackAddToCart(data);
  }, []);

  // Track purchase
  const trackOrder = useCallback((purchase: PurchaseEvent) => {
    trackPurchase(purchase);
  }, []);

  // Track search
  const trackSearchQuery = useCallback((search: SearchEvent) => {
    trackSearch(search);
  }, []);

  // Track employee actions
  const trackEmployeeAction = useCallback((action: string, parameters = {}) => {
    if (user?.publicMetadata?.isEmployee) {
      analyticsService.trackEmployeeAction(action, {
        employee_role: user.publicMetadata.employeeRole,
        employee_id: user.id,
        ...parameters
      });
    }
  }, [user]);

  // Track admin actions
  const trackAdminAction = useCallback((action: string, resource: string, parameters = {}) => {
    if (user?.publicMetadata?.employeeRole === 'admin') {
      analyticsService.trackAdminAction(action, resource, {
        admin_id: user.id,
        ...parameters
      });
    }
  }, [user]);

  // Track order status changes
  const trackOrderStatus = useCallback((orderId: string, oldStatus: string, newStatus: string) => {
    analyticsService.trackOrderStatusChange(
      orderId, 
      oldStatus, 
      newStatus, 
      user?.publicMetadata?.employeeRole as string
    );
  }, [user]);

  // Track performance metrics
  const trackPerformance = useCallback((metricName: string, value: number, unit = 'ms') => {
    analyticsService.trackPerformanceMetric(metricName, value, unit);
  }, []);

  // Track errors
  const trackAnalyticsError = useCallback((error: Error, context = '') => {
    trackError(error, context);
  }, []);

  // Track custom events
  const trackCustomEvent = useCallback((eventName: string, parameters = {}) => {
    analyticsService.trackCustomEvent(eventName, {
      user_id: user?.id || null,
      user_type: user?.publicMetadata?.isEmployee ? 'employee' : 'customer',
      ...parameters
    });
  }, [user]);

  return {
    trackProduct,
    trackCart,
    trackOrder,
    trackSearchQuery,
    trackEmployeeAction,
    trackAdminAction,
    trackOrderStatus,
    trackPerformance,
    trackError: trackAnalyticsError,
    trackCustomEvent,
  };
};

// Helper function to get page name from pathname
function getPageName(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) return 'Home';
  if (segments[0] === 'admin') return `Admin - ${segments[1] || 'Dashboard'}`;
  if (segments[0] === 'employee') return `Employee - ${segments[1] || 'Dashboard'}`;
  if (segments[0] === 'products') {
    if (segments[1]) return `Product Detail - ${segments[1]}`;
    return 'Products';
  }
  if (segments[0] === 'category') return `Category - ${segments[1] || 'All'}`;
  if (segments[0] === 'cart') return 'Shopping Cart';
  if (segments[0] === 'checkout') return 'Checkout';
  if (segments[0] === 'orders') return 'Orders';
  if (segments[0] === 'sign-in') return 'Sign In';
  if (segments[0] === 'sign-up') return 'Sign Up';
  
  return segments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' - ');
}

// Performance tracking hook
export const usePerformanceTracking = () => {
  const { trackPerformance } = useAnalytics();

  const trackLoadTime = useCallback((startTime: number, metricName: string) => {
    const loadTime = Date.now() - startTime;
    trackPerformance(metricName, loadTime);
  }, [trackPerformance]);

  const trackAPICall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    apiName: string
  ): Promise<T> => {
    const startTime = Date.now();
    try {
      const result = await apiCall();
      const duration = Date.now() - startTime;
      trackPerformance(`api_${apiName}`, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      trackPerformance(`api_${apiName}_error`, duration);
      throw error;
    }
  }, [trackPerformance]);

  return {
    trackLoadTime,
    trackAPICall,
  };
};

// E-commerce tracking hook
export const useEcommerceTracking = () => {
  const { trackProduct, trackCart, trackOrder } = useAnalytics();

  const trackProductView = useCallback((productId: string, productName: string, category: string, price: number) => {
    trackProduct({
      item_id: productId,
      item_name: productName,
      item_category: category,
      price: price,
      currency: 'USD'
    });
  }, [trackProduct]);

  const trackAddToCart = useCallback((items: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
  }>) => {
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    trackCart({
      currency: 'USD',
      value: totalValue,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        quantity: item.quantity,
        price: item.price
      }))
    });
  }, [trackCart]);

  const trackPurchase = useCallback((orderId: string, items: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
  }>, totalValue: number) => {
    trackOrder({
      transaction_id: orderId,
      value: totalValue,
      currency: 'USD',
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        quantity: item.quantity,
        price: item.price
      }))
    });
  }, [trackOrder]);

  return {
    trackProductView,
    trackAddToCart,
    trackPurchase,
  };
};