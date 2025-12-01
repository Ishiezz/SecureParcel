import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { COLORS as BASE_COLORS } from '../constants/colors';

const ThemeContext = createContext();

const THEMES = {
    default: {
        primary: '#D4AF37', // Gold
        secondary: '#F1C40F',
        success: '#2ecc71',
    },
    student: {
        primary: '#D4AF37', // Gold
        secondary: '#F1C40F',
        success: '#2ecc71',
    },
    delivery: {
        primary: '#E67E22', // Orange
        secondary: '#F39C12',
        success: '#27ae60',
    },
    guard: {
        primary: '#3498db', // Blue
        secondary: '#2980b9',
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
