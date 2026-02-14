import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Prioritize mock auth for now
        navigate('/security');
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-icon">🎙️</div>
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to continue listening</p>

                <form className="auth-form" onSubmit={handleLogin}>
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
                        Sign In
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account?
                    <Link to="/register" className="auth-link">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
