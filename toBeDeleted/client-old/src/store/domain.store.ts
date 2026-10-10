import { searchDomain } from "@/api/domain";
import { DomainItem, DomainState } from "@/utils/interface";
import { create } from "zustand";

export const useDomainStore = create<DomainState>((set) => ({
    domain: [],
    domainStatus: "",
    loading: false,
    message: "",
    error: "",

    action: {
        searchDomain: async (item: DomainItem) => {
            set({ loading: true, error: "", message: "" });
            try {
                const response = await searchDomain(item);
                if (!response.error) {
                    set({ domain: response.result, message: response.message, loading: false });
                } else {
                    set({ domain: [], message: "", loading: false, error: response.error });
                }
            } catch (err: any) {
                set({ domain: [], message: "", loading: false, error: err.message });
            }
        },

        clearDomain: () => set({ domain: [], domainStatus: "", message: "", loading: false, error: "" }),
    }
}));

export const useDomainAction = useDomainStore.getState().action