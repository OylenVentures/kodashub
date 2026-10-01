import {
  loginUser,
  logout,
  logoutAll,
  registerUser,
  resendVerification,
  sendPasscode,
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
        set({ userEmail: response.user.email, isLoading: false });
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

      if (!response.error) {
        set({ message: response.message, isLoading: false });
      } else {
        set({ message: null, isLoading: false, error: response.error });
      }
    } catch (err: any) {
      set({ message: null, isLoading: false, error: err.message });
    }
  },

  resendVerification: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resendVerification({ email });
      set({ isLoading: false });
      return { message: response.message, error: null };
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { message: null, error: err.message };
    }
  },

  sendPasscode: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await sendPasscode({ email });
      set({ isLoading: false });
      return { message: response.message, error: null };
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { message: null, error: err.message };
    }
  },

  login: async (email, passcode) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginUser({ email, password: passcode });

      if (response.statusCode === 200) {
        set({
          accessToken: response.accessToken,
          userEmail: response.user.email,
          isLoading: false,
        });
        return { message: response.message, error: null };
      } else {
        set({ isLoading: false, error: response.message });
        return { message: null, error: response.message };
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { message: null, error: err.message };
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
      if (!response.error) {
        set({ message: response.message, isLoading: false, error: null });
      } else {
        set({ message: null, isLoading: false, error: response.error });
      }
    } catch (err: any) {
      set({ message: null, isLoading: false, error: err.message });
    }
  },
}));
