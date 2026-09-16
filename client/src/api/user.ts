// User API Handler
import { UserItem } from "@/utils/interface";
import apiHandler from "./api"

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await apiHandler(`auth/login`, "POST", { email, password })
        return response;
    } catch (error) {
        return error;
    }
}

export const registerUser = async (dto: UserItem) => {
    try {
        const response = await apiHandler(`auth/register`, "POST", dto)
        return response;
    } catch (error) {
        return error;
    }
}

// user api request
export const getUserProfile = async () => {
    try {
        const response = await apiHandler(`user/me`, "GET")
        return response;
    } catch (error) {
        return error;
    }
}

export const updateUserProfile = async (dto: UserItem) => {
    try {
        const response = await apiHandler(`user/me`, "PATCH", dto)
        return response;
    } catch (error) {
        return error;
    }
}

export const updateUserPassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
        const response = await apiHandler(`user/me/password`, "PATCH", { currentPassword, newPassword, confirmPassword })
        return response;
    } catch (error) {
        return error;
    }
}

export const deleteUserProfile = async () => {
    try {
        const response = await apiHandler(`user/me`, "DELETE")
        return response;
    } catch (error) {
        return error;
    }
}

// admin api request
export const createAdminUser = async (dto: UserItem) => {
    try {
        const response = await apiHandler(`user`, "POST", dto)
        return response;
    } catch (error) {
        return error;
    }
}

export const getAllUser = async () => {
    try {
        const response = await apiHandler(`user`, "GET")
        return response;
    } catch (error) {
        return error;
    }
}

export const getUserDetails = async (id: string) => {
    try {
        const response = await apiHandler(`user/${id}`, "GET")
        return response;
    } catch (error) {
        return error;
    }
}

export const restoreUserAccount = async (id: string) => {
    try {
        const response = await apiHandler(`user/${id}`, "PATCH")
        return response;
    } catch (error) {
        return error;
    }
}

export const removeUserAccount = async (id: string) => {
    try {
        const response = await apiHandler(`user/${id}`, "DELETE")
        return response;
    } catch (error) {
        return error;
    }
}