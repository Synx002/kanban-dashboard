import axiosClient from '../api/axiosClient';
import type { UserProfile, UserResponse } from '../types';

export const authService = {
    login: async (username: string, password: string): Promise<UserResponse> => {
        const response = await axiosClient.post<UserResponse>('/auth/login', {
            username,
            password,
            expiresInMins: 30,
        });
        return response.data;
    },

    getCurrentUser: async (): Promise<UserProfile> => {
        const response = await axiosClient.get<UserProfile>('/auth/me');
        return response.data;
    },
};
