// Tool API Handler
import {
  LoginUserItem,
  RegisterUserItem,
  SendEmailItem,
  VerifyUserItem,
} from "@/utils/interface";
import apiHandler from "./api";

export const registerUser = async (dto: RegisterUserItem) => {
  try {
    const response = await apiHandler(`auth/register`, "POST", dto);
    return response;
  } catch (error) {
    return error;
  }
};

export const verifyUser = async (dto: VerifyUserItem) => {
  try {
    const response = await apiHandler(`auth/verify-email`, "POST", dto);
    return response;
  } catch (error) {
    return error;
  }
};

export const resendVerification = async (dto: SendEmailItem) => {
  try {
    const response = await apiHandler(`auth/resend-verification`, "POST", dto);
    return response;
  } catch (error) {
    return error;
  }
};

export const loginUser = async (dto: SendEmailItem) => {
  try {
    const response = await apiHandler(`auth/login`, "POST", dto);
    return response;
  } catch (error) {
    return error;
  }
};

export const verifyPasscode = async (dto: LoginUserItem) => {
  try {
    const response = await apiHandler(`auth/verify-passcode`, "POST", dto);
    return response;
  } catch (error) {
    return error;
  }
};

export const refreshToken = async () => {
  try {
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "include",
    //   },
    // );
    // return await response.json();

    const response = await apiHandler(`auth/refresh`, "POST");
    return await response;
  } catch (error) {
    return error;
  }
};

export const logout = async () => {
  try {
    const response = await apiHandler(`auth/logout`, "POST");
    return response;
  } catch (error) {
    return error;
  }
};

export const logoutAll = async () => {
  try {
    const response = await apiHandler(`auth/logout-all`, "POST");
    return response;
  } catch (error) {
    return error;
  }
};
