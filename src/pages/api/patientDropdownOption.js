import axios from "@/configs/axios/satufarmasi-service-axios"
import { useState } from 'react'

export default function usePatientDropdownOption() {
    const [isLoading, setIsLoading] = useState(null);

    const getPatientDropdownOptions = async() => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/v1/patients/dropdownOptions')
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
        getPatientDropdownOptions
    }
}
