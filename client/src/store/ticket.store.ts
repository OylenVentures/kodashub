import {
  createTicket,
  listTickets,
  replyTicket,
  viewTicket,
} from "@/api/ticket";
import {
  TicketBodyItem,
  TicketQueryItem,
  TicketReplyItem,
  TicketState,
} from "@/utils/interface";
import { create } from "zustand";

export const useTicketStore = create<TicketState>((set) => ({
  tickets: [],
  replies: [],
  total: 0,
  page: 1,
  limit: 50,
  isLoading: false,
  message: "",
  error: "",

  action: {
    setReplies: (reply) => set({ replies: reply }),

    listTickets: async (data: TicketQueryItem) => {
      set({ isLoading: true, error: "" });
      try {
        const response = await listTickets(data);
        if (response.statusCode === 200) {
          set({
            tickets: response.data,
            total: response.total,
            page: response.page,
            limit: response.limit,
            message: response.message,
            isLoading: false,
          });
          return { message: response.message };
        } else {
          set({
            tickets: [],
            message: "",
            isLoading: false,
            error: response.message,
          });
          return { error: response.message };
        }
      } catch (err: any) {
        set({ tickets: [], message: "", isLoading: false, error: err.message });
        return { error: err.message };
      }
    },

    viewTicket: async (id: string) => {
      set({ isLoading: true, error: "" });
      try {
        const response = await viewTicket(id);
        if (response.statusCode === 200) {
          set({
            replies: response.replies,
            isLoading: false,
          });
          return { replies: response.replies };
        } else {
          set({
            replies: [],
            isLoading: false,
            error: response.message,
          });
          return { error: response.message };
        }
      } catch (err: any) {
        set({ replies: [], isLoading: false, error: err.message });
        return { error: err.message };
      }
    },

    createTicket: async (data: TicketBodyItem) => {
      set({ isLoading: true, error: "" });
      try {
        const response = await createTicket(data);
        if (response.statusCode === 201) {
          set({ isLoading: false });
          return { message: "Ticket created" };
        } else {
          set({
            tickets: [],
            message: "",
            isLoading: false,
            error: response.message,
          });
          return { error: response.message };
        }
      } catch (err: any) {
        set({ tickets: [], message: "", isLoading: false, error: err.message });
        return { error: err.message };
      }
    },

    replyTicket: async (id: string, data: TicketReplyItem) => {
      set({ isLoading: true, error: "" });
      try {
        const response = await replyTicket(id, data);
        if (response.statusCode === 200) {
          set({ isLoading: false });
          return { ticket: response, message: "Reply sent" };
        } else {
          set({
            replies: [],
            message: "",
            isLoading: false,
            error: response.message,
          });
          return { error: response.message };
        }
      } catch (err: any) {
        set({ replies: [], message: "", isLoading: false, error: err.message });
        return { error: err.message };
      }
    },
  },
}));

export const useTicketAction = useTicketStore.getState().action;
