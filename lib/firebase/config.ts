import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | null = null;
let firestore: Firestore;

if (typeof window !== 'undefined' && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  firestore = getFirestore(app);
  
  // Initialize Analytics only in browser environment
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
} else if (getApps().length > 0) {
  app = getApps()[0];
  firestore = getFirestore(app);
} else {
  // Server-side initialization
  app = initializeApp(firebaseConfig);
  firestore = getFirestore(app);
}

export { app, analytics, firestore };

// Helper function to check if analytics is available
export const isAnalyticsAvailable = (): boolean => {
  return typeof window !== 'undefined' && analytics !== null;
};