import axios from "@/components/configs/axios/satufarmasi-service-axios"
import { useState } from "react";

export default function usePackagingAPI() {
    const [isLoading, setIsLoading] = useState(false);

    const GetAllPackaging = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/v1/packagings')
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

    const GetPackagingById = async (id) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/api/v1/packagings?id=${id}`)
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
        GetPackagingById,
        CreatePackaging,
        EditPackaging
    }
}