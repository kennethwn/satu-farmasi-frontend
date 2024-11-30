import api from "../../configs/axios/satufarmasi-service-axios"
import { useState } from 'react';

export default function usePharmacy() {
    const [isLoading, setIsLoading] = useState(false);

    const getPharmacyInfo = async () => {
        setIsLoading(true)
        const response  = await api.get(`api/v1/pharmacy`)
        .then((response) => {
            setIsLoading(false);
            return response;
        })
        .catch((error) => {
            setIsLoading(false);
            return error;
        })
        return response 
    }

    const updatePharmacy = async (data) => {
        setIsLoading(true)
        const response  = await api.put(`api/v1/pharmacy`, {data})
        .then((response) => {
            setIsLoading(false);
            return response;
        })
        .catch((error) => {
            setIsLoading(false);
            return error;
        })
        return response 
    }

    return {
        isLoading,
        getPharmacyInfo,
        updatePharmacy
    }
}
