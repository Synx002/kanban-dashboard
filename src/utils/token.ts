import type { UserProfile } from '../types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const tokenStorage = {
    getAccessToken: (): string | null => {
        return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem('token');
    },

    getRefreshToken: (): string | null => {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    getUser: (): UserProfile | null => {
        const user = localStorage.getItem(USER_KEY);
        if (!user) return null;
        try {
            return JSON.parse(user) as UserProfile;
        } catch {
            return null;
        }
    },

    setTokens: (accessToken: string, refreshToken?: string) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem('token', accessToken);
        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
    },

    setUser: (user: UserProfile) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    clear: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem('token');
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
};

