// Domain API Handler
import { ContactItem, RequestItem } from "@/utils/interface";
import apiHandler from "./api";

export const requestService = async (dto: RequestItem) => {
  try {
    const response = await apiHandler(
      `notification/request-service`,
      "POST",
      dto,
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const contact = async (dto: ContactItem) => {
  try {
    const response = await apiHandler(`notification/contact`, "POST", dto);
    return response;
  } catch (error) {
    return error;
  }
};
