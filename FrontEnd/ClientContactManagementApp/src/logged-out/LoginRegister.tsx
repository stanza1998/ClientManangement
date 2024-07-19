import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../context/Base';
import './LoginRegister.css'; // Import the CSS file

interface CustomCSSProperties extends React.CSSProperties {
    '--i'?: number;
}

const LoginRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            localStorage.setItem('email', email); // Store email in local storage before login
            const response = await api.post('/api/Auth/login', { email, password });
            if (response.status === 200) {
                const { token } = response.data;
                login(token, email); // Call login with token and email
                setLoading(false);
            } else {
                alert('Login failed');
            }
        } catch (error) {
            setEmail('');
            setPassword('');
            alert('Wrong email or password');
            setLoading(false);
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-box">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label>Email</label>
                    </div>
                    <div className="input-box">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label>Password</label>
                        <a
                            href="#"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide password' : 'Show password'}
                        </a>
                    </div>
                    <div className="forgot-pass">
                        <a href="#">Forgot your password?</a>
                    </div>
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                    <div className="signup-link">
                        <p>Have no account yet? <a href="#">Signup</a></p>
                    </div>
                </form>
            </div>

  
        </div>
    );
};

export default LoginRegister;
