import { useState } from "react";
import axios from "@/configs/axios/satufarmasi-service-axios";

export default function useReportAPI() {
    const [isLoading, setIsLoading] = useState(false);

    const GetAllReports = async (page, limit) => {
        setIsLoading(true);
        try {
            return await axios.get(
                `/api/v1/reports?page=${page}&limit=${limit}`,
            );
        } catch (error) {
            console.error(error);
            throw error.response.data;
        } finally {
            setIsLoading(false);
        }
    };

    const GetReportById = async (id) => {
        setIsLoading(true);
        try {
            return await axios.get(`/api/v1/reports/${id}`);
        } catch (error) {
            console.error(error);
            throw error.response.data;
        } finally {
            setIsLoading(false);
        }
    };

    const finalizeReport = async (id) => {
        setIsLoading(true);
        try {
            return await axios.post(`/api/v1/reports/${id}`);
        } catch (error) {
            console.error(error.response.data);
            throw error.response.data;
        } finally {
            setIsLoading(false);
        }
    }


    return {
        isLoading,
        GetAllReports,
        GetReportById,
        finalizeReport,
    };
}
