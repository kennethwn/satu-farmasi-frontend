import axios from "@/components/configs/axios/satufarmasi-service-axios"
import { useState } from "react"

export default function useGenericAPI() {
    const [isLoading, setIsLoading] = useState(false);

    const GetAllGeneric = async (page, limit) => {
        try {
            setIsLoading(true)
            const response = await axios.get(`/api/v1/genericName?page=${page}&limit=${limit}`)
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

    const GetGenericByLabel = async (label) => {
        try {
            setIsLoading(true)
            const response = await axios.get(`/api/v1/genericName?&label=${label}`)
                .then((response) => {
                    setIsLoading(false);
                    return response;
                })
                .catch((error) => {
                    setIsLoading(false);
                    return error;
                })
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    const CreateGeneric = async (data) => {
        try {
            const response = await axios.post('/api/v1/genericName', data)
                .then((response) => {
                    setIsLoading(false);
                    return response;
                })
                .catch((error) => {
                    setIsLoading(false);
                    return error;
                })
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    const EditGeneric = async (data) => {
        try {
            const response = await axios.put(`/api/v1/genericName/${data.id}`, data)
                .then((response) => {
                    setIsLoading(false);
                    return response;
                })
                .catch((error) => {
                    setIsLoading(false);
                    return error;
                })
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    const DeleteGeneric = async (data) => {
        try {
            const response = await axios.delete(`/api/v1/genericName/${data.id}`)
                .then((response) => {
                    setIsLoading(false);
                    return response;
                })
                .catch((error) => {
                    setIsLoading(false);
                    return error;
                })
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    return {
        isLoading,
        GetAllGeneric,
        GetGenericByLabel,
        CreateGeneric,
        EditGeneric,
        DeleteGeneric
    }
}