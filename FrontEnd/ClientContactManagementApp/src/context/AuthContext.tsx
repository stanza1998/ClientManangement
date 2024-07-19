import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string, email: string) => void;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const token = localStorage.getItem('token');
        return !!token; // Set initial state based on the presence of a token
    });

    useEffect(() => {
        const validateToken = async () => {
            const email = localStorage.getItem('email'); // Assuming email is stored in local storage
            console.log("🚀 ~ validateToken ~ email:", email);

            if (email) {
                try {
                    // Send the email as a raw string
                    const response = await axios.post('https://localhost:7286/api/Auth/validate-token', email, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log("🚀 ~ validateToken ~ response:", response);
                    if (response.data) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                        localStorage.removeItem('token'); // Remove invalid token
                    }
                } catch (error) {
                    console.error('Token validation error:', error);
                    setIsAuthenticated(false);
                    localStorage.removeItem('token'); // Remove invalid token
                }
            }
        };

        validateToken();
    }, []);




    const login = (token: string, email: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('email', email); // Store email in local storage
        setIsAuthenticated(true);
    };

    const logout = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.post('/api/auth/logout', { token });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        localStorage.removeItem('token');
        localStorage.removeItem('email'); // Remove email from local storage
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
