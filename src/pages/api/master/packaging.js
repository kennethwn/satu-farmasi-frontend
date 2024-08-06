import axios from "@/components/configs/axios/satufarmasi-service-axios"
import { useState } from "react";

export default function usePackagingAPI() {
    const [isLoading, setIsLoading] = useState(false);

    const GetAllPackaging = async (page, limit) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/api/v1/packagings?page=${page}&limit=${limit}`)
            .then((response) => {
                setIsLoading(false);
                return response;
            })
            .catch((error) => {
                setIsLoading(false);
                return error;
            })
            return response
        } catch (error) {
            console.error(error);
        }
    }

    const GetPackagingByLabel = async (label) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/api/v1/packagings?label=${label}`)
            .then((response) => {
                setIsLoading(false);
                return response;
            })
            .catch((error) => {
                setIsLoading(false);
                return error;
            })
            return response
        } catch (error) {
            console.error(error);
        }
    }

    const CreatePackaging = async (data) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/v1/packagings', data)
            .then((response) => {
                setIsLoading(false);
                return response;
            })
            .catch((error) => {
                setIsLoading(false);
                return error;
            })
            return response
        } catch (error) {
            console.error(error);
        }
    }

    const EditPackaging = async (data) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/v1/packagings/edit', data)
            .then((response) => {
                setIsLoading(false);
                return response;
            })
            .catch((error) => {
                setIsLoading(false);
                return error;
            })
            return response
        } catch (error) {
            console.error(error);
        }
    }

    return {
        isLoading,
        GetAllPackaging,
        GetPackagingByLabel,
        CreatePackaging,
        EditPackaging
    }
}