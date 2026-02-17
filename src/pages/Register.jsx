import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithGoogle, registerWithEmail } from '../api/auth';
import '../styles/login.css';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleRegister = async () => {
        try {
            setLoading(true);
            setError('');
            await signInWithGoogle();
            navigate('/security');
        } catch (error) {
            console.error("Google Sign-Up Error:", error);
            setError("Failed to sign up with Google.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await registerWithEmail(email, password, name);
            navigate('/security');
        } catch (err) {
            console.error('Registration error:', err);
            setError('Registration failed. Please try again.');
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
                        <div className="auth-orb-icon">🎙️</div>
                    </div>
                </div>

                <h2 className="auth-title">Create your account</h2>

                {error && <div className="auth-error">{error}</div>}

                <button
                    onClick={handleGoogleRegister}
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

                <form className="auth-form" onSubmit={handleRegister}>
                    <input
                        type="text"
                        className="auth-input"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

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
                        {loading ? 'Creating Account...' : 'Sign up'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
