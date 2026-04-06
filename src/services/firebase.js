import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);

// Detects mobile/tablet across ALL browsers — Chrome, Firefox, Edge, Safari, Opera
export const isMobile = () => {
    // Check 1: Common mobile/tablet user agents — Android, iOS, Opera Mini, IE Mobile
    const mobileUA = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

    // Check 2: Chrome Mobile, Firefox Mobile, Edge Mobile all include "Mobile" or "Tablet"
    const mobileBrowser = /Mobile|Tablet/i.test(navigator.userAgent);

    // Check 3: Screen width fallback — catches any browser on a small screen
    const smallScreen = window.innerWidth <= 768;

    // Check 4: Touch-only device with no fine pointer (mouse) — strong signal it's mobile/tablet
    const touchOnly = navigator.maxTouchPoints > 1 && !window.matchMedia('(pointer: fine)').matches;

    return mobileUA || mobileBrowser || smallScreen || touchOnly;
};