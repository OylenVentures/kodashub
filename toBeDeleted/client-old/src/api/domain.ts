// Domain API Handler
import { DomainItem } from "@/utils/interface";
import apiHandler from "./api"

export const searchDomain = async (dto: DomainItem) => {
    try {
        const response = await apiHandler(`domain/search`, "POST", dto)
        return response;
    } catch (error) {
        return error;
    }
}

export const getUserDomain = async () => {
    try {
        const response = await apiHandler(`domain/user`, "GET")
        return response;
    } catch (error) {
        return error;
    }
}

