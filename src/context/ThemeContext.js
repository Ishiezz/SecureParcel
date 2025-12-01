import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
const BASE_COLORS = {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#D4AF37',
    secondary: '#F1C40F',
    success: '#2ecc71',
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B0B0',
    inputBackground: '#2C2C2C',
    border: '#333333',
    error: '#e74c3c',
    warning: '#f39c12',
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0,0,0,0.7)',
};

const ThemeContext = createContext();

const THEMES = {
    default: {
        primary: '#D4AF37',
        secondary: '#F1C40F',
        success: '#2ecc71',
    },
    student: {
        primary: '#D4AF37',
        secondary: '#F1C40F',
        success: '#2ecc71',
    },
    delivery: {
        primary: '#2980b9',
        secondary: '#3498db',
        success: '#27ae60',
    },
    guard: {
        primary: '#8e44ad',
        secondary: '#9b59b6',
        success: '#2ecc71',
    }
};

export const ThemeProvider = ({ children }) => {
    const { user } = useAuth();
    const [theme, setTheme] = useState(THEMES.default);

    useEffect(() => {
        if (user && user.role && THEMES[user.role]) {
            setTheme(THEMES[user.role]);
        } else {
            setTheme(THEMES.default);
        }
    }, [user]);

    const colors = {
        ...BASE_COLORS,
        ...theme
    };

    return (
        <ThemeContext.Provider value={{ colors, themeName: user?.role || 'default' }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
