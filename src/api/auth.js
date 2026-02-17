import api from './config';
import { auth, googleProvider } from '../services/firebase';
import { 
    signInWithPopup, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from 'firebase/auth';

// Google Sign-In
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        localStorage.setItem('authToken', idToken);
        
        // Verify with backend
        const response = await api.get('/auth/login');
        return response.data;
    } catch (error) {
        console.error('Google sign-in error:', error);
        throw error;
    }
};

// Email/Password Sign-In
export const signInWithEmail = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await result.user.getIdToken();
        localStorage.setItem('authToken', idToken);
        
        // Verify with backend
        const response = await api.get('/auth/login');
        return response.data;
    } catch (error) {
        console.error('Email sign-in error:', error);
        throw error;
    }
};

// Email/Password Registration
export const registerWithEmail = async (email, password, displayName) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await result.user.getIdToken();
        localStorage.setItem('authToken', idToken);
        
        // Update profile if displayName provided
        if (displayName) {
            await result.user.updateProfile({ displayName });
        }
        
        // Verify with backend
        const response = await api.get('/auth/login');
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

// Sign Out
export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        localStorage.removeItem('authToken');
    } catch (error) {
        console.error('Sign-out error:', error);
        throw error;
    }
};

// Get current user info
export const getCurrentUser = async () => {
    const response = await api.get('/auth/login');
    return response.data;
};

// Send password reset email
export const sendPasswordResetEmail = async (email) => {
    try {
        await firebaseSendPasswordResetEmail(auth, email);
        return { success: true, message: 'Password reset email sent' };
    } catch (error) {
        console.error('Password reset error:', error);
        throw error;
    }
};

// Change password (for logged-in users)
export const changePassword = async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
    });
    return response.data;
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken') && !!auth.currentUser;
};
