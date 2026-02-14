import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import '../styles/register.css';
import '../styles/login.css'; // Reusing form styles for consistency

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/register', {
                name,
                email,
                password
            });

            // Assuming register returns token directly or success message
            // Note: User prompt said POST /api/auth/register
            // Usually autosigns in or redirects to login.
            // Let's assume we redirect to Login for safety unless token is returned.

            const token = response.data.token || response.data.data?.token;
            if (token) {
                localStorage.setItem('token', token);
                navigate('/security'); // Go to personalization
            } else {
                navigate('/login');
            }

        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <h2 className="register-title">Create Account</h2>
                <p className="register-subtitle">Join the community of listeners</p>

                {error && <div className="text-red-500 mb-4 bg-red-500/10 p-2 rounded text-sm">{error}</div>}

                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login">
                        Sign Up
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?
                    <Link to="/login" className="auth-link">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
