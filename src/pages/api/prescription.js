import { useRouter } from 'next/router';
import api from "../../configs/axios/satufarmasi-service-axios"
import { useState } from 'react';
import { convertToTimestampString } from '@/helpers/dayHelper';

export default function usePrescription() {
    const [isLoading, setIsLoading] = useState(false);

    const getAllPrescription = async () => {
        setIsLoading(true)
        try {
            return await api.get("/api/v1/prescriptions")
                .then((response) => {
                    setIsLoading(false)
                    return response;
                })
                .catch((error) => {
                    setIsLoading(false)
                    return error;
                })
        } catch (error) {
            return error;
        }
    }

    const getSearchedPrescription = async (username) => {
        console.log("HIT GET SEARCH")
        setIsLoading(true)
        try {
            return await api.get("/api/v1/prescriptions?username=", {
                params: {
                    username: username
                }
            })
            .then((response) => {
                setIsLoading(false)
                return response;
            })
            .catch((error) => {
                setIsLoading(false)
                return error;
            })
        } catch (error) {
            return error;
        }
    }

    return {
        isLoading,
        getAllPrescription,
        getSearchedPrescription
    }
}
