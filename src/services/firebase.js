import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDBQosoOgqEa0LONZhEZUSVJjV1diFMdCk",
    authDomain: "ethio-podcast-8a2f0.firebaseapp.com",
    projectId: "ethio-podcast-8a2f0",
    storageBucket: "ethio-podcast-8a2f0.firebasestorage.app",
    messagingSenderId: "976795435136",
    appId: "1:976795435136:web:fa34145b172223cdad6665",
    measurementId: "G-268RCQ7PBM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
