// Tool API Handler
import { StorageSyncItem, VoltCalcItem } from "@/utils/interface";
import apiHandler from "./api"

export const voltCalc = async (dto: VoltCalcItem) => {
    try {
        const response = await apiHandler(`tool/voltcalc`, "POST", dto)
        return response;
    } catch (error) {
        return error;
    }
}

export const cloudinaryS3Sync = async (dto: StorageSyncItem) => {
    try {
        const response = await apiHandler(`tool/cloudinary-s3-sync`, "POST", dto)
        return response;
    } catch (error) {
        return error;
    }
}

export const cloudflareS3Sync = async (dto: StorageSyncItem) => {
    try {
        const response = await apiHandler(`tool/cloudflare-s3-sync`, "POST", dto)
        return response;
    } catch (error) {
        return error;
    }
}

