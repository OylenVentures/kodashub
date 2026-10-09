// Tool API Handler
import {
  TicketQueryItem,
  TicketBodyItem,
  TicketReplyItem,
} from "@/utils/interface";
import apiHandler from "./api";

export const listTickets = async (dto: TicketQueryItem) => {
  try {
    const response = await apiHandler(
      `tickets?page=${dto.page || 1}&limit=${dto.limit || 20}` +
        `${dto.status ? `&status=${dto.status}` : ""}` +
        `${dto.department ? `&department=${dto.department}` : ""}` +
        `${dto.priority ? `&priority=${dto.priority}` : ""}`,
      "GET",
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const viewTicket = async (id: string) => {
  try {
    const response = await apiHandler(`tickets/${id}`, "GET");
    return response;
  } catch (error) {
    return error;
  }
};

export const createTicket = async (dto: TicketBodyItem) => {
  try {
    const response = await apiHandler(`tickets`, "POST", dto);
    return response;
  } catch (error) {
    return error;
  }
};

export const replyTicket = async (id: string, dto: TicketReplyItem) => {
  try {
    const response = await apiHandler(`tickets/${id}/reply`, "POST", dto);
    return response;
  } catch (error) {
    return error;
  }
};

export const updateTicket = async (dto: TicketBodyItem) => {
  try {
    const response = await apiHandler(`tickets`, "POST", dto);
    return response;
  } catch (error) {
    return error;
  }
};
