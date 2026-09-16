// API BASE URL HANDLER
import { useUserStore } from "../store/user.store";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiHandler = async (endpoint: string, method: string, body?: any) => {
    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        const token = useUserStore.getState().token;
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: method,
            headers: headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        // Simulated interceptor: Handle 401 globally (skipping tool API, as 3rd party keys might throw 401s)
        if (response.status === 401 && !endpoint.startsWith("tool/")) {
            toast.error("Unauthorized access. Please log in again.");
            useUserStore.getState().action.logout();
            window.location.href = "/account";
            // Return an object that won't blow up the stores
            return { success: false, message: "Unauthorized access." };
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
}

export default apiHandler;
