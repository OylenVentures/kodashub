// Log API Handler
import apiHandler from "./api"

export const checkLog = async () => {
    try {
        const response = await apiHandler(`log`, "GET")
        return response;
    } catch (error) {
        return error;
    }
}
