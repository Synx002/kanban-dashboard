import { create } from 'zustand';
import type { UserProfile } from '../types';
import { authService } from '../services/authService';
import { tokenStorage } from '../utils/token';

interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: tokenStorage.getUser(),
    isAuthenticated: !!tokenStorage.getAccessToken(),
    isLoading: !!tokenStorage.getAccessToken(),

    login: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
            const data = await authService.login(username, password);
            const token = data.accessToken || data.token || '';
            const refreshToken = data.refreshToken;

            const profile: UserProfile = {
                id: data.id,
                username: data.username,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                image: data.image,
            };

            tokenStorage.setTokens(token, refreshToken);
            tokenStorage.setUser(profile);

            set({
                user: profile,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        tokenStorage.clear();
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    },

    checkAuth: async () => {
        const token = tokenStorage.getAccessToken();
        if (!token) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return false;
        }

        try {
            const userProfile = await authService.getCurrentUser();
            tokenStorage.setUser(userProfile);
            set({
                user: userProfile,
                isAuthenticated: true,
                isLoading: false,
            });
            return true;
        } catch {
            tokenStorage.clear();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
            return false;
        }
    },
}));

