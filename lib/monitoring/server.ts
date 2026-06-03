// Server-side monitoring initializer
// This file ensures monitoring is only initialized in server environments

import AutomatedMonitoring from './automated';

let monitoringInitialized = false;

export function initializeMonitoring(): void {
  // Only initialize on server side and only once
  if (typeof window === 'undefined' && !monitoringInitialized && typeof process !== 'undefined') {
    try {
      const monitoring = AutomatedMonitoring.getInstance();
      monitoring.startMonitoring();
      monitoringInitialized = true;
      console.log('✅ Monitoring system initialized successfully');
    } catch (error) {
      console.warn('⚠️ Failed to initialize monitoring system:', error);
    }
  }
}

export function isMonitoringEnabled(): boolean {
  return monitoringInitialized && typeof window === 'undefined';
}

// Auto-initialize when this module is loaded on the server
if (typeof window === 'undefined') {
  initializeMonitoring();
}

export { AutomatedMonitoring };