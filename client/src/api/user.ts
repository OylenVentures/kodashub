// User API Handler
import { UserItem } from "@/utils/interface";
import apiHandler from "./api";

export const getUserProfile = async () => {
  try {
    const response = await apiHandler(`users/me`, "GET");
    return response;
  } catch (error) {
    return error;
  }
};

export const updateUserProfile = async (dto: UserItem) => {
  try {
    const response = await apiHandler(`users/me`, "PATCH", dto);
    return response;
  } catch (error) {
    return error;
  }
};
