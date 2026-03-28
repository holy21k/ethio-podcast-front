import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save } from 'lucide-react';
import { getUserProfile, updateUserProfile, uploadProfilePhoto } from '../api';
import { auth } from '../services/firebase';
import Navbar from '../components/Navbar';
import '../styles/home.css';

const EditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        photoURL: '',
        interests: []
    });
    const [interestsInput, setInterestsInput] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                navigate('/login');
                return;
            }

            // Set initial data from Firebase while backend loads
            setFormData({
                displayName: currentUser.displayName || '',
                bio: '',
                photoURL: currentUser.photoURL || '',
                interests: []
            });
            setInterestsInput('');

            // Try to get full profile from backend (includes Supabase photo URL)
            try {
                const response = await getUserProfile();
                const profile =
                    response?.data?.profile ||
                    response?.data ||
                    response;

                const interests = profile.interests || [];
                setFormData({
                    displayName: profile.displayName || currentUser.displayName || '',
                    bio: profile.bio || '',
                    photoURL: profile.photoURL || currentUser.photoURL || '',
                    interests
                });
                setInterestsInput(interests.join(', '));
            } catch (err) {
                console.log('Backend profile not available, using Firebase data:', err.message);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('Image size should be less than 10MB');
            return;
        }

        try {
            setUploading(true);
            setUploadProgress(0);

            const currentUser = auth.currentUser;
            if (!currentUser) {
                alert('Please login first');
                return;
            }

            // Simulate progress since we're doing a single POST (not resumable)
            setUploadProgress(30);

            // Upload via backend → Supabase Storage
            // uploadProfilePhoto reads the file as base64 and POSTs to /api/user/upload-photo
            const response = await uploadProfilePhoto(file);

            setUploadProgress(100);

            // Extract the Supabase public URL from the response
            const photoURL =
                response?.data?.photoURL ||
                response?.photoURL;

            if (photoURL) {
                setFormData(prev => ({ ...prev, photoURL }));
                alert('Photo uploaded! Click "Save Changes" to update your profile.');
            } else {
                throw new Error('No photo URL returned from server');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
            setUploadProgress(0);
            // Reset file input so same file can be re-selected if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            const interests = interestsInput
                ? interestsInput.split(',').map(i => i.trim()).filter(i => i)
                : [];

            await updateUserProfile({
                displayName: formData.displayName,
                bio: formData.bio,
                photoURL: formData.photoURL,
                interests
            });

            alert('Profile updated successfully!');
            navigate('/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading...</p>
                </div>
                <Navbar />
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: '#a8a8b8',
                        cursor: 'pointer',
                        marginBottom: '1rem',
                        padding: 0,
                        fontSize: '0.95rem'
                    }}
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white', margin: 0 }}>
                    Edit Profile
                </h1>
            </div>

            {/* Profile Photo */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '4px solid #8b5cf6',
                        boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)',
                        background: 'rgba(139, 92, 246, 0.1)',
                        position: 'relative'
                    }}>
                        <img
                            src={formData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.displayName || 'User')}&background=8b5cf6&color=fff&size=256`}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.displayName || 'User')}&background=8b5cf6&color=fff&size=256`;
                            }}
                        />
                        {uploading && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0, 0, 0, 0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}>
                                <div className="loading-spinner" style={{ width: '30px', height: '30px' }}></div>
                                <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: '600' }}>
                                    {uploadProgress}%
                                </span>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#8b5cf6',
                            border: '3px solid #0a0a1f',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: uploading ? 'not-allowed' : 'pointer',
                            opacity: uploading ? 0.6 : 1
                        }}
                    >
                        <Camera size={16} color="white" />
                    </button>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#a8a8b8', textAlign: 'center' }}>
                    {uploading ? `Uploading: ${uploadProgress}%` : 'Click camera icon to upload photo'}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center', marginTop: '0.25rem' }}>
                    Max size: 10MB • Formats: JPG, PNG, GIF
                </p>
            </div>

            {/* Form */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                borderRadius: '20px',
                padding: '1.5rem',
                marginBottom: '1.5rem'
            }}>
                {/* Display Name */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '0.5rem'
                    }}>
                        Display Name
                    </label>
                    <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder="Enter your name"
                        style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem',
                            color: 'white',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>

                {/* Photo URL — read only, auto-filled by Supabase upload */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '0.5rem'
                    }}>
                        Photo URL (auto-filled after upload)
                    </label>
                    <input
                        type="url"
                        value={formData.photoURL}
                        readOnly
                        placeholder="Upload a photo above to set URL"
                        style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem',
                            color: 'white',
                            fontSize: '0.95rem',
                            opacity: 0.7,
                            cursor: 'not-allowed'
                        }}
                    />
                </div>

                {/* Bio */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '0.5rem'
                    }}>
                        Bio
                    </label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem',
                            color: 'white',
                            fontSize: '0.95rem',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                {/* Interests */}
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '0.5rem'
                    }}>
                        Interests
                    </label>
                    <input
                        type="text"
                        value={interestsInput}
                        onChange={(e) => setInterestsInput(e.target.value)}
                        placeholder="Tech, Business, Lifestyle (comma separated)"
                        style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem',
                            color: 'white',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving || uploading}
                style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: saving || uploading ? 'not-allowed' : 'pointer',
                    opacity: saving || uploading ? 0.6 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)'
                }}
            >
                <Save size={20} />
                <span>{saving ? 'Saving...' : uploading ? 'Upload in progress...' : 'Save Changes'}</span>
            </button>

            <Navbar />
        </div>
    );
};

export default EditProfile;