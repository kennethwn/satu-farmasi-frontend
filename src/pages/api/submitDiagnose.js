import api from "../../configs/axios/satufarmasi-service-axios"
import { useRouter } from 'next/router';
import { useState } from 'react'

export default function useSubmitDiagnose() {
    const [isLoading, setIsLoading] = useState(null);
    const router = useRouter()

    const submitDiagnose = async(data) => {
        try {
            setIsLoading(true)
            return await api.post('/api/v1/diagnose', {data})
        } catch (error) {
            console.log("error bro: ", error)
            throw error.response.data.errors
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        submitDiagnose
    }
}
