import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithGoogle, signInWithEmail, handleRedirectResult } from '../api/auth';
import '../styles/login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // On mobile, after Google redirect brings user back to this page,
    // getRedirectResult() picks up the result and logs them in
    useEffect(() => {
        const checkRedirect = async () => {
            setLoading(true);
            const success = await handleRedirectResult();
            if (success) navigate('/home');
            setLoading(false);
        };
        checkRedirect();
    }, []);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            await signInWithGoogle();
            // Desktop: popup resolves here → navigate
            // Mobile: page redirects → useEffect above handles navigation
            navigate('/home');
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            setError("Failed to sign in with Google.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmail(email, password);
            navigate('/home');
        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-content">
                <div className="auth-orb-container">
                    <div className="auth-orb-glow"></div>
                    <div className="auth-orb">
                        <div className="auth-orb-icon">💡</div>
                    </div>
                </div>

                <h2 className="auth-title">Let's you in</h2>

                {error && <div className="auth-error">{error}</div>}

                <button
                    onClick={handleGoogleLogin}
                    className="auth-google-btn"
                    disabled={loading}
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="google-icon"
                    />
                    Continue with Google
                </button>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        className="auth-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="auth-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign in'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;