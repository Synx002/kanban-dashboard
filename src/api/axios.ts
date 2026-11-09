import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

export const tokenStorage = {
    getAccess: () => localStorage.getItem("accessToken"),
    getRefresh: () => localStorage.getItem("refreshToken"),
    set: (access: string, refresh: string) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
    },
    clear: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    },
};

export const api = axios.create({
    baseURL: "https://dummyjson.com",
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = tokenStorage.getAccess();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const original = error.config as RetryConfig;
        const status = error.response?.status;

        if (status === 401 && original && !original._retry && tokenStorage.getRefresh()) {
            original._retry = true;
            try {
                const { data } = await axios.post("https://dummyjson.com/auth/refresh", {
                    refreshToken: tokenStorage.getRefresh(),
                    expiresInMins: 30,
                });
                tokenStorage.set(data.accessToken, data.refreshToken);
                original.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(original);
            } catch {
                tokenStorage.clear();
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
        const s = err.response?.status;
        if (s === 400) return err.response?.data?.message ?? "Username atau password salah.";
        if (s === 401) return "Sesi berakhir, silakan login kembali.";
        if (s === 403) return "Anda tidak memiliki akses.";
        if (s && s >= 500) return "Terjadi kesalahan server, coba lagi nanti.";
        if (err.code === "ECONNABORTED") return "Koneksi timeout.";
    }
    return "Terjadi kesalahan yang tidak diketahui.";
};