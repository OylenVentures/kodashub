// User API Handler
import { UserItem, UserQueryItem } from "@/utils/interface";
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

export const listUsers = async (dto: UserQueryItem) => {
  try {
    const response = await apiHandler(
      `users?page=${dto.page || 1}&limit=${dto.limit || 20}` +
        `${dto.role ? `&role=${dto.role}` : ""}` +
        `${dto.email ? `&email=${dto.email}` : ""}`,
      "GET",
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getUserDetails = async (id: string) => {
  try {
    const response = await apiHandler(`users/${id}`, "GET");
    return response;
  } catch (error) {
    return error;
  }
};

export const createUser = async (dto: UserItem) => {
  try {
    const response = await apiHandler(`users`, "POST", dto);
    return response;
  } catch (error) {
    return error;
  }
};

export const updateUserDetails = async (id: string, dto: UserItem) => {
  try {
    const response = await apiHandler(`users/${id}`, "PATCH", dto);
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await apiHandler(`users/${id}`, "DELETE");
    return response;
  } catch (error) {
    return error;
  }
};
