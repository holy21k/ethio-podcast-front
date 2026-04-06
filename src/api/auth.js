import api from './config';
import { auth, googleProvider, isMobile } from '../services/firebase';
import {
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut as firebaseSignOut,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from 'firebase/auth';

export const signInWithGoogle = async () => {
    try {
        if (isMobile()) {
            // Mobile/tablet: redirect flow (popup is blocked by all mobile browsers)
            await signInWithRedirect(auth, googleProvider);
            return; // page reloads — result is handled by handleRedirectResult()
        } else {
            // Desktop: popup works on Chrome, Firefox, Edge, Safari, Opera
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            localStorage.setItem('authToken', idToken);
            const response = await api.get('/auth/login');
            return response.data;
        }
    } catch (error) {
        console.error('Google sign-in error:', error);
        throw error;
    }
};

// Call this once on Login and Register page mount to catch the redirect result on mobile
export const handleRedirectResult = async () => {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            const idToken = await result.user.getIdToken();
            localStorage.setItem('authToken', idToken);
            await api.get('/auth/login');
            return true; // signals redirect login succeeded → navigate away
        }
        return false;
    } catch (error) {
        console.error('Redirect result error:', error);
        return false;
    }
};

export const signInWithEmail = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await result.user.getIdToken();
        localStorage.setItem('authToken', idToken);
        const response = await api.get('/auth/login');
        return response.data;
    } catch (error) {
        console.error('Email sign-in error:', error);
        throw error;
    }
};

export const registerWithEmail = async (email, password, displayName) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
            await updateProfile(result.user, { displayName });
        }
        const idToken = await result.user.getIdToken();
        localStorage.setItem('authToken', idToken);
        const response = await api.get('/auth/login');
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    } catch (error) {
        console.error('Sign-out error:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/login');
    return response.data;
};

export const sendPasswordResetEmail = async (email) => {
    try {
        await firebaseSendPasswordResetEmail(auth, email);
        return { success: true, message: 'Password reset email sent' };
    } catch (error) {
        console.error('Password reset error:', error);
        throw error;
    }
};

export const changePassword = async (newPassword) => {
    const response = await api.post('/auth/change-password', { newPassword });
    return response.data;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken') && !!auth.currentUser;
};

export const uploadProfilePhoto = async (file) => {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            return reject(new Error('File must be an image'));
        }
        if (file.size > 5 * 1024 * 1024) {
            return reject(new Error('Image must be under 5MB'));
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const base64Image = e.target.result;
                const response = await api.post('/user/upload-photo', { base64Image });
                resolve(response.data);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

export const deleteProfilePhoto = async () => {
    const response = await api.delete('/user/photo');
    return response.data;
};