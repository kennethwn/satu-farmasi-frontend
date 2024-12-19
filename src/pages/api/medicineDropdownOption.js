import api from "../../configs/axios/satufarmasi-service-axios"
import { useState } from 'react'

export default function useMedicineDropdownOption() {
    const [isLoading, setIsLoading] = useState(null);

    const getMedicineDropdownOptions = async(is_active, is_prescription) => {
        setIsLoading(true)
        try {
            console.log("getting medicine dropdown")
            const response = await api.get('/api/v1/medicines/dropdownOptions?is_active=' + is_active + '&is_prescription=' + is_prescription)
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

    const getMedicineDropdownOptionsById = async() => {
        setIsLoading(true)
        try {
            console.log("getting medicine dropdown")
            const response = await api.get('/api/v1/medicines/dropdownOptionsById')
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
        getMedicineDropdownOptions,
        getMedicineDropdownOptionsById
    }
}
