import axios, {
    type InternalAxiosRequestConfig,
    type AxiosResponse,
    type AxiosError,
} from 'axios';
import { tokenStorage } from '../utils/token';

const axiosClient = axios.create({
    baseURL: 'https://dummyjson.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenStorage.getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
            originalRequest?.url?.includes('/auth/refresh');

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;
            const refreshToken = tokenStorage.getRefreshToken();

            if (refreshToken) {
                try {
                    const res = await axios.post('https://dummyjson.com/auth/refresh', {
                        refreshToken,
                        expiresInMins: 30,
                    });
                    const { accessToken, refreshToken: newRefreshToken } = res.data;
                    tokenStorage.setTokens(accessToken, newRefreshToken || refreshToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return axiosClient(originalRequest);
                } catch (refreshError) {
                    tokenStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                tokenStorage.clear();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
        const s = err.response?.status;
        const serverMessage = err.response?.data?.message;
        if (serverMessage) return serverMessage;
        if (s === 400) return 'Username atau password salah.';
        if (s === 401) return 'Sesi berakhir atau autentikasi gagal. Silakan login kembali.';
        if (s === 403) return 'Anda tidak memiliki hak akses.';
        if (s && s >= 500) return 'Terjadi gangguan pada server, silakan coba lagi nanti.';
        if (err.code === 'ECONNABORTED') return 'Koneksi timeout, silakan periksa internet Anda.';
    }
    return 'Terjadi kesalahan, silakan coba lagi.';
};

export default axiosClient;
