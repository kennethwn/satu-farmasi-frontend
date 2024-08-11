import axios from "@/configs/axios/satufarmasi-service-axios"
import { useRouter } from 'next/router';
import { useState } from 'react'

export default function useSubmitDiagnose() {
    const [isLoading, setIsLoading] = useState(null);
    const router = useRouter()

    const submitDiagnose = async(data) => {
        try {
            console.log(data)
            const response = await axios.post('/api/v1/diagnose', {data})
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
        submitDiagnose
    }
}
