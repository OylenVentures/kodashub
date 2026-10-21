import {
  createUser,
  deleteUser,
  getUserDetails,
  getUserProfile,
  listUsers,
  updateUserDetails,
  updateUserProfile,
} from "@/api/user";
import { UserItem, UserQueryItem, UserState } from "@/utils/interface";
import { create } from "zustand";

export const useUserStore = create<UserState>((set) => ({
  users: [],
  user: [],
  total: 0,
  page: 1,
  limit: 50,
  isLoading: false,
  message: "",
  error: "",

  action: {
    setUser: (user) => set({ user }),

    getUserProfile: async () => {
      set({ isLoading: true, error: "" });
      try {
        const response = await getUserProfile();
        if (response.statusCode === 200) {
          set({
            user: response,
            isLoading: false,
          });
          return { user: response };
        } else {
          set({
            user: [],
            isLoading: false,
            error: response.message,
          });
          return { error: response.message };
        }
      } catch (err: any) {
        set({
          user: [],
          isLoading: false,
          error: err.message,
        });
        return { error: err.message };
      }
    },

    updateUserProfile: async (data: UserItem) => {
      set({ isLoading: true, error: "" });
      try {
        const response = await updateUserProfile(data);
        if (response.statusCode === 200) {
          set({ user: response, isLoading: false, error: "" });
          return { user: response };
        } else {
          set({
            user: [],
            isLoading: false,
            error: response.message,
          });
          return { error: response.message };
        }
      } catch (err: any) {
        set({
          user: [],
          message: "",
          isLoading: false,
          error: err.message,
        });
        return { error: err.message };
      }
    },

    listUsers: async (data: UserQueryItem) => {
      set({ isLoading: true, error: "" });
      try {
        const response = await listUsers(data);
        if (response.statusCode === 200) {
          set({
            users: response.data,
            total: response.total,
            page: response.page,
            limit: response.limit,
            message: response.message,
            isLoading: false,
          });
          return { message: response.message };
        } else {
          set({
            users: [],
            message: "",
            isLoading: false,
            error: response.message,
          });
          return { error: response.message };
        }
      } catch (err: any) {
        set({ users: [], message: "", isLoading: false, error: err.message });
        return { error: err.message };
      }
    },

    getUserDetails: async (id) => {
      set({ isLoading: true, error: "" });
      try {
        const response = await getUserDetails(id);
        if (response.statusCode === 200) {
          set({
            user: response,
            isLoading: false,
          });
          return { user: response };
        } else {
          set({
            user: [],
            isLoading: false,
            error: response.message,
          });
          return { error: response.message };
        }
      } catch (err: any) {
        set({
          user: [],
          isLoading: false,
          error: err.message,
        });
        return { error: err.message };
      }
    },

    createUser: async (data: UserItem) => {
      set({ isLoading: true, error: "" });
      try {
        const response = await createUser(data);
        if (response.statusCode === 201) {
          set({ user: response, isLoading: false, error: "" });
          return { user: response, message: response.message };
        } else {
          set({
            user: [],
            isLoading: false,
            error: response.message,
          });
          return { error: response.message };
        }
      } catch (err: any) {
        set({
          user: [],
          message: "",
          isLoading: false,
          error: err.message,
        });
        return { error: err.message };
      }
    },

    updateUserDetails: async (id, data: UserItem) => {
      set({ isLoading: true, error: "" });
      try {
        const response = await updateUserDetails(id, data);
        if (response.statusCode === 200) {
          set({ user: response, isLoading: false, error: "" });
          return { user: response };
        } else {
          set({
            user: [],
            isLoading: false,
            error: response.message,
          });
          return { error: response.message };
        }
      } catch (err: any) {
        set({
          user: [],
          message: "",
          isLoading: false,
          error: err.message,
        });
        return { error: err.message };
      }
    },

    deleteUser: async (id) => {
      set({ isLoading: true, error: "" });
      try {
        const response = await deleteUser(id);
        if (response.statusCode === 200) {
          set({
            user: response,
            isLoading: false,
          });
          return { user: response };
        } else {
          set({
            user: [],
            isLoading: false,
            error: response.message,
          });
          return { error: response.message };
        }
      } catch (err: any) {
        set({
          user: [],
          isLoading: false,
          error: err.message,
        });
        return { error: err.message };
      }
    },
  },
}));

export const useUserAction = useUserStore.getState().action;
