import { create } from 'zustand';
import { Role } from '../types';

export type ThemeMode = 'light' | 'dark';

export const DARK_COLORS = {
    background: '#000000', // True Black
    surface: '#0A0A0A', // Almost black
    card: '#0A0A0A',
    text: '#FFFFFF',
    mode: 'dark' as ThemeMode,
    primary: '#FFFFFF', // Default to student
    secondary: '#A3A3A3',
    success: '#10B981', // Vercel Emerald
    textPrimary: '#FFFFFF',
    textSecondary: '#888888',
    inputBackground: '#111111',
    border: '#222222', // Subtle titanium borders
    error: '#EF4444',
    warning: '#F59E0B',
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0,0,0,0.85)',
    glassBackground: 'rgba(255,255,255,0.03)',
    glassBorder: 'rgba(255,255,255,0.08)'
};

export const LIGHT_COLORS = {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#121212',
    mode: 'light' as ThemeMode,
    primary: '#D4AF37', // Default to student
    secondary: '#F1C40F',
    success: '#27ae60',
    textPrimary: '#121212',
    textSecondary: '#666666',
    inputBackground: '#E8E8E8',
    border: '#DDDDDD',
    error: '#e74c3c',
    warning: '#f39c12',
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0,0,0,0.4)',
    glassBackground: 'rgba(0,0,0,0.03)',
    glassBorder: 'rgba(0,0,0,0.08)'
};

const THEMES: Record<Role | 'default', { primary: string, secondary: string }> = {
    default: {
        primary: '#FFFFFF',
        secondary: '#A3A3A3',
    },
    student: {
        primary: '#FFFFFF', // Clean White Apple aesthetic
        secondary: '#A3A3A3',
    },
    delivery: {
        primary: '#06B6D4', // Neon Cyan
        secondary: '#0891B2',
    },
    guard: {
        primary: '#F59E0B', // Amber Alert Radar
        secondary: '#D97706',
    },
    admin: {
        primary: '#8B5CF6', // Purple
        secondary: '#7C3AED',
    }
};

interface ThemeState {
    themeName: Role | 'default';
    themeMode: ThemeMode;
    theme: typeof DARK_COLORS;
    colors: typeof DARK_COLORS;
    setThemeByRole: (role?: Role) => void;
    toggleThemeMode: () => void;
    setThemeMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    themeName: 'default',
    themeMode: 'dark', // Default to dark mode for premium feel
    theme: DARK_COLORS,
    colors: DARK_COLORS,
    
    setThemeByRole: (role?: Role) => set((state) => {
        const themeKey = role || 'default';
        const isLight = state.themeMode === 'light';
        const base = isLight ? LIGHT_COLORS : DARK_COLORS;
        
        const roleTheme = { ...THEMES[themeKey] };
        if (themeKey === 'student' || themeKey === 'default') {
            roleTheme.primary = isLight ? '#000000' : '#FFFFFF';
        }

        const newTheme = {
            ...base,
            ...roleTheme
        };
        return {
            themeName: themeKey,
            theme: newTheme,
            colors: newTheme
        };
    }),

    toggleThemeMode: () => set((state) => {
        const newMode = state.themeMode === 'light' ? 'dark' : 'light';
        const isLight = newMode === 'light';
        const base = isLight ? LIGHT_COLORS : DARK_COLORS;
        
        const roleTheme = { ...THEMES[state.themeName] };
        if (state.themeName === 'student' || state.themeName === 'default') {
            roleTheme.primary = isLight ? '#000000' : '#FFFFFF';
        }

        const newTheme = {
            ...base,
            ...roleTheme
        };
        return {
            themeMode: newMode,
            theme: newTheme,
            colors: newTheme
        };
    }),

    setThemeMode: (mode: ThemeMode) => set((state) => {
        const isLight = mode === 'light';
        const base = isLight ? LIGHT_COLORS : DARK_COLORS;
        
        const roleTheme = { ...THEMES[state.themeName] };
        if (state.themeName === 'student' || state.themeName === 'default') {
            roleTheme.primary = isLight ? '#000000' : '#FFFFFF';
        }

        const newTheme = {
            ...base,
            ...roleTheme
        };
        return {
            themeMode: mode,
            theme: newTheme,
            colors: newTheme
        };
    })
}));
