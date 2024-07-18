import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

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
        const validateToken = () => {
            const email = localStorage.getItem('email'); // Assuming email is stored in local storage
            console.log("🚀 ~ validateToken ~ email:", email);

            if (email) {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://localhost:7286/api/Auth/validate-token', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            const isValid = JSON.parse(xhr.responseText);
                            console.log("🚀 ~ validateToken ~ response:", isValid);
                            if (isValid) {
                                setIsAuthenticated(true);
                            } else {
                                setIsAuthenticated(false);
                                localStorage.removeItem('token'); // Remove invalid token
                            }
                        } else {
                            console.error('Token validation error:', xhr.statusText);
                            setIsAuthenticated(false);
                            localStorage.removeItem('token'); // Remove invalid token
                        }
                    }
                };
                xhr.send(JSON.stringify(email));
            }
        };

        validateToken();
    }, []);

    const login = (token: string, email: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('email', email); // Store email in local storage
        setIsAuthenticated(true);
    };

    const logout = () => {
        const email = localStorage.getItem('email');
        if (email) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://localhost:7286/api/Auth/logout', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        // Successfully logged out
                        localStorage.removeItem('token');
                        localStorage.removeItem('email'); // Remove email from local storage
                        setIsAuthenticated(false);
                    } else {
                        console.error('Logout error:', xhr.statusText);
                    }
                }
            };
            xhr.send(JSON.stringify({ email }));
        }
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
