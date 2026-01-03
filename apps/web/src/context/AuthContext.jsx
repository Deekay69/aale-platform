import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    // Verify token and get user data
                    const response = await api.get('/api/auth/me');
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to load user', error);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', { email, password });
            const { token: newToken, user: userData } = response.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
            return userData;
        } catch (error) {
            throw error.response?.data?.error || 'Login failed';
        }
    };

    const register = async (name, email, password, role = 'student') => {
        try {
            const response = await api.post('/api/auth/register', { name, email, password, role });
            const { token: newToken, user: userData } = response.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
            return userData;
        } catch (error) {
            throw error.response?.data?.error || 'Registration failed';
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
