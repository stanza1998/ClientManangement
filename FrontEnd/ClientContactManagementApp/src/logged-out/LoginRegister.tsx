// LoginRegister.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../context/Base';


const LoginRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            localStorage.setItem('email', email); // Store email in local storage before login
            const response = await api.post('/api/Auth/login', { email, password });
            if (response.status === 200) {
                const { token } = response.data;
                login(token, email); // Call login with token and email
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginRegister;
