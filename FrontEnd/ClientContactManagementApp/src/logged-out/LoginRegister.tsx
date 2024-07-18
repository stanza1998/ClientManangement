import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../context/Base';
import './LoginRegister.css'; // Import the CSS file

const LoginRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const { login } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

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
            console.error('Error:', error);
        }
    };

    return (
        <form className="login-container" onSubmit={handleLogin}>
            <div className="overlay"></div>
            <div className="login-box">
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div className="password-container">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <a href='#'
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? 'Hide password' : 'Show password'}
                    </a>
                </div>
                <button type='submit' disabled={loading}>
                    {loading ? "Logging In..." : "Login"}
                </button>
            </div>
        </form>
    );
};

export default LoginRegister;
