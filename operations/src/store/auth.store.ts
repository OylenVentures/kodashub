import {
  loginUser,
  logout,
  logoutAll,
  refreshToken,
  registerUser,
  resendVerification,
  verifyPasscode,
  verifyUser,
} from "@/api/auth";
import { AuthState } from "@/utils/interface";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userEmail: "",
  isLoading: false,
  message: null,
  error: null,

  setUserEmail: (email) => set({ userEmail: email }),
  setAccessToken: (token) => set({ accessToken: token }),

  signup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await registerUser(data);
      if (response.statusCode === 201) {
        set({ message: response.message, isLoading: false });
        return { message: response.message, error: null };
      } else {
        set({ message: null, isLoading: false, error: response.message });
        return { message: null, error: response.message };
      }
    } catch (err: any) {
      set({ message: null, isLoading: false, error: err.message });
      return { message: null, error: err.message };
    }
  },

  verifyEmail: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await verifyUser({ token });
      if (response.statusCode === 200) {
        set({ message: response.message, isLoading: false });
        return { message: response.message, error: null };
      } else {
        set({ message: null, isLoading: false, error: response.message });
        return { message: null, error: response.message };
      }
    } catch (err: any) {
      set({ message: null, isLoading: false, error: err.message });
      return { message: null, error: err.message };
    }
  },

  resendVerification: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resendVerification({ email });
      if (response.statusCode !== 200) {
        set({ isLoading: false, error: response.message });
        return { message: null, error: response.message };
      }
      set({ isLoading: false });
      return { message: response.message, error: null };
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { message: null, error: err.message };
    }
  },

  login: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginUser({ email });
      if (response.statusCode !== 200) {
        set({ isLoading: false, error: response.message });
        return { message: null, error: response.message };
      }
      set({ isLoading: false });
      return { message: response.message, error: null };
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { message: null, error: err.message };
    }
  },

  verifyPasscode: async (email, passcode) => {
    set({ isLoading: true, error: null });
    try {
      const response = await verifyPasscode({ email, password: passcode });
      if (response.statusCode === 200) {
        set({
          accessToken: response.accessToken,
          userEmail: response.user.email,
          isLoading: false,
        });
        return { message: "Login successful", error: null };
      } else {
        set({ isLoading: false, error: response.message });
        return { message: null, error: response.message };
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { message: null, error: err.message };
    }
  },

  refreshToken: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await refreshToken();
      if (response.statusCode === 200) {
        set({
          accessToken: response.accessToken,
          userEmail: response.user.email,
          isLoading: false,
        });
        return {
          accessToken: response.accessToken,
          userEmail: response.user.email,
        };
      } else {
        set({ isLoading: false, error: response.message });
        return {
          error: response.message,
        };
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { error: err.message };
    }
  },

  logout: async () => {
    await logout();
    set({ accessToken: null, userEmail: "" });
  },

  logoutAll: async () => {
    set({ isLoading: true, error: "" });
    try {
      const response = await logoutAll();
      if (response.statusCode === 200) {
        set({ message: response.message, isLoading: false, error: null });
      } else {
        set({ message: null, isLoading: false, error: response.error });
      }
    } catch (err: any) {
      set({ message: null, isLoading: false, error: err.message });
    }
  },
}));
