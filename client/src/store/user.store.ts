import { createAdminUser, deleteUserProfile, getUserDetails, getUserProfile, loginUser, registerUser, removeUserAccount, restoreUserAccount, updateUserPassword, updateUserProfile } from "@/api/user";
import { UserItem, UserState } from "@/utils/interface";
import { create } from "zustand";

export const useUserStore = create<UserState>((set) => ({
    users: [],
    currentUser: [],
    token: "",
    loading: false,
    message: "",
    error: "",

    action: {
        registerUser: async (item: UserItem) => {
            set({ loading: true, error: "" });
            try {
                const response = await registerUser(item);
                if (response.success) {
                    set({ users: response.result, message: response.message, loading: false });
                } else {
                    set({ users: [], message: "", loading: false, error: response.message });
                }
            } catch (err: any) {
                set({ users: [], message: "", loading: false, error: err.message });
            }
        },

        loginUser: async (item: { email: string, password: string }) => {
            set({ loading: true, error: "" });
            try {
                const response = await loginUser(item.email, item.password);
                if (response.success) {
                    set({ token: response.result.token, message: response.message, loading: false });
                } else {
                    set({ token: "", message: "", loading: false, error: response.message });
                }
            } catch (err: any) {
                set({ token: "", message: "", loading: false, error: err.message });
            }
        },

        getUserProfile: async () => {
            set({ loading: true, error: "" });
            try {
                const response = await getUserProfile();
                if (response.success) {
                    set({ currentUser: response.result, message: response.message, loading: false });
                } else {
                    set({ currentUser: [], message: "", loading: false, error: response.message });
                }
            } catch (err: any) {
                set({
                    currentUser: [], message: "", loading: false, error: err.message
                });
            }
        },

        updateUserProfile: async (item: UserItem) => {
            set({ loading: true, error: "" });
            try {
                const response = await updateUserProfile(item);
                if (response.success) {
                    set({ message: response.message, loading: false });
                } else {
                    set({ users: [], message: "", loading: false, error: response.message });
                }
            } catch (err: any) {
                set({
                    users: [], message: "", loading: false, error: err.message
                });
            }
        },

        updateUserPassword: async (item: { currentPassword: string, newPassword: string, confimPassword: string }) => {
            set({ loading: true, error: "" });
            try {
                const response = await updateUserPassword(item.currentPassword, item.newPassword, item.confimPassword);
                if (response.success) {
                    set({ currentUser: [], message: response.message, loading: false });
                } else {
                    set({ currentUser: [], message: "", loading: false, error: response.message });
                }
            } catch (err: any) {
                set({
                    currentUser: [], message: "", loading: false, error: err.message
                });
            }
        },

        deleteUserProfile: async () => {
            set({ loading: true, error: "" });
            try {
                const response = await deleteUserProfile();
                if (response.success) {
                    set({ currentUser: [], message: response.message, loading: false });
                } else {
                    set({ currentUser: [], message: "", loading: false, error: response.message });
                }
            } catch (err: any) {
                set({
                    currentUser: [], message: "", loading: false, error: err.message
                });
            }
        },

        createAdminUser: async (item: UserItem) => {
            set({ loading: true, error: "" });
            try {
                const response = await createAdminUser(item);
                if (response.success) {
                    set({ users: response.result, message: response.message, loading: false });
                } else {
                    set({ users: [], message: "", loading: false, error: response.message });
                }
            } catch (err: any) {
                set({ users: [], message: "", loading: false, error: err.message });
            }
        },

        getUserDetails: async (userId: string) => {
            set({ loading: true, error: "" });
            try {
                const response = await getUserDetails(userId);
                if (response.success) {
                    set({ users: response.result, message: response.message, loading: false });
                } else {
                    set({ users: [], message: "", loading: false, error: response.message });
                }
            } catch (err: any) {
                set({
                    users: [], message: "", loading: false, error: err.message
                });
            }
        },

        restoreUserAccount: async (userId: string) => {
            set({ loading: true, error: "" });
            try {
                const response = await restoreUserAccount(userId);
                if (response.success) {
                    set({ message: response.message, loading: false });
                } else {
                    set({ users: [], message: "", loading: false, error: response.message });
                }
            } catch (err: any) {
                set({
                    users: [], message: "", loading: false, error: err.message
                });
            }
        },

        removeUserAccount: async (userId: string) => {
            set({ loading: true, error: "" });
            try {
                const response = await removeUserAccount(userId);
                if (response.success) {
                    set({ message: response.message, loading: false });
                } else {
                    set({ users: [], message: "", loading: false, error: response.message });
                }
            } catch (err: any) {
                set({
                    users: [], message: "", loading: false, error: err.message
                });
            }
        },

        clearUser: () => set({ users: [], message: "", loading: false, error: "" }),
        logout: () => set({ currentUser: [], message: "", loading: false, error: "" }),
    }
}));

export const useUserAction = useUserStore.getState().action