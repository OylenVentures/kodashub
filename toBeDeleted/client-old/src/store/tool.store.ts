import { voltCalc, cloudinaryS3Sync, cloudflareS3Sync } from "@/api/tool";
import { ToolState, VoltCalcItem, StorageSyncItem } from "@/utils/interface";
import { create } from "zustand";

export const useToolStore = create<ToolState>((set) => ({
    voltCalc: [],
    storageSync: [],
    loading: false,
    message: "",
    error: "",

    action: {
        voltCalc: async (item: VoltCalcItem) => {
            set({ loading: true, error: "" });
            try {
                const response = await voltCalc(item);
                if (!response.error) {
                    set({ voltCalc: response.result, message: response.message, loading: false });
                } else {
                    set({ voltCalc: [], message: "", loading: false, error: response.error });
                }
            } catch (err: any) {
                set({ voltCalc: [], message: "", loading: false, error: err.message });
            }
        },

        storageSync: async (item: StorageSyncItem) => {
            set({ loading: true, error: "" });
            try {
                // Infer which sync API to call based on the prevStorageName or a new prop.
                // Assuming cloudflare if it mentions r2, else cloudinary. Or we can just build logic on fileType.
                let response;
                // Currently matching off an arbitrary prop check to see if it's meant for cloudflare vs cloudinary
                // You can restructure your interface to add a provider string if needed.
                if (item.prevAccountId) {
                    response = await cloudflareS3Sync(item);
                } else {
                    response = await cloudinaryS3Sync(item);
                }

                if (response?.success) {
                    set({ storageSync: response.result || ["Synced"], message: response.message, loading: false });
                } else {
                    set({ storageSync: [], message: "", loading: false, error: response?.message || "Sync Failed" });
                }
            } catch (err: any) {
                set({ storageSync: [], message: "", loading: false, error: err.message });
            }
        },

        clearVoltCalc: () => set({ voltCalc: [], message: "", loading: false, error: "" }),
        clearStorageSync: () => set({ storageSync: [], message: "", loading: false, error: "" }),
    }
}));

export const useToolAction = useToolStore.getState().action;
