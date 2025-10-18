import { hybridStorage } from '@/src/core/utils/hybrid-storage';
import { User } from "@/src/modules/auth/auth.model";
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
    isAuthenticated: boolean;
    isAuthInitialized: boolean;
    user: User | null;
    token: string | null;

    // Actions
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
    initializeAuth: () => Promise<void>;
    updateUser: (partialUser: Partial<User>) => void;
    updateToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            isAuthInitialized: false,
            user: null,
            token: null,

            setAuth: (user, token) => {
                set({
                    isAuthenticated: !!user && !!token,
                    user,
                    token
                });
            },

            clearAuth: () => {
                set({
                    isAuthenticated: false,
                    user: null,
                    token: null
                });
            },
            initializeAuth: async () => {
                set({ isAuthInitialized: true });
            },
            updateUser: (partialUser) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...partialUser } });
                }
            },
            updateToken: (token) => {
                set({ token });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => hybridStorage('token')),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                // isAuthenticated: state.isAuthenticated,
            })
        }
    )
);

export const selectSetAuth = (state: AuthState) => state.setAuth;
export const selectClearAuth = (state: AuthState) => state.clearAuth;
export const selectAuthInitialize = (state: AuthState) => state.initializeAuth;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsAuthInitialized = (state: AuthState) => state.isAuthInitialized;
export const selectUser = (state: AuthState) => state.user;
export const selectToken = (state: AuthState) => state.token;   
export const selectUpdateUser = (state: AuthState) => state.updateUser; 
export const selectUpdateToken = (state: AuthState) => state.updateToken; 