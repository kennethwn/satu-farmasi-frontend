import api from "../../configs/axios/satufarmasi-service-axios"
import { useRouter } from 'next/router';
import { useState } from 'react'

export default function useDiagnose() {
    const [isLoading, setIsLoading] = useState(null);
    const router = useRouter()

    const submitDiagnose = async(data) => {
        try {
            setIsLoading(true)
            return await api.post('/api/v1/diagnose/create', {data})
        } catch (error) {
            console.log("error bro: ", error)
            throw error.response.data.errors
        } finally {
            setIsLoading(false)
        }
    }

    const getDiagnoseSummary = async (data, limit, page) => {
        try {
            setIsLoading(true);
            return await api.post(`/api/v1/diagnose?limit=${limit}&startIndex=${page}`, data)
        } catch (error) {
            console.log("error: ", error);
            throw error.response.data.errors
        } finally {
            setIsLoading(false);
        }
    }

    const getDiagnoseDetailById = async (id) => {
        try {
            setIsLoading(true);
            return await api.get(`/api/v1/diagnose/${id}`)
        } catch (error) {
            console.log("error: ", error);
            throw error.response.data.errors
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        submitDiagnose,
        getDiagnoseSummary,
        getDiagnoseDetailById
    }
}
