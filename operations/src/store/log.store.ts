import { checkLog } from "@/api/log";
import { LogState } from "@/utils/interface";
import { create } from "zustand";

export const useLogStore = create<LogState>((set) => ({
    logs: [],
    loading: false,
    message: "",
    error: "",

    action: {
        getLog: async () => {
             set({ loading: true, error: "" });
             try {
                 const response = await checkLog();
                 if (response.success) {
                     set({ logs: response.result, message: response.message, loading: false });
                 } else {
                     set({ logs: [], message: "", loading: false, error: response.message });
                 }
             } catch (err: any) {
                 set({ logs: [], message: "", loading: false, error: err.message });
             }
        },

        clearLog: () => set({ logs: [], message: "", loading: false, error: "" })
    }
}));

export const useLogAction = useLogStore.getState().action;
