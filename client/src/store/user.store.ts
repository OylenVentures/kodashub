import { getUserProfile, updateUserProfile } from "@/api/user";
import { UserItem, UserState } from "@/utils/interface";
import { create } from "zustand";

export const useUserStore = create<UserState>((set) => ({
  user: [],
  isLoading: false,
  message: "",
  error: "",

  action: {
    setUser: (user) => set({ user }),

    getUserProfile: async () => {
      set({ isLoading: true, error: "" });
      try {
        const response = await getUserProfile();
        if (response.id) {
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
        if (response.id) {
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
  },
}));

export const useUserAction = useUserStore.getState().action;
