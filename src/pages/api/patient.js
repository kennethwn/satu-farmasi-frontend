import api from "../../configs/axios/satufarmasi-service-axios"
import { useState } from 'react'

export default function usePatientAPI() {
    const [isLoading, setIsLoading] = useState(null);

    const getPatientDropdownOptions = async() => {
        setIsLoading(true)
        try {
            const response = await api.get('/api/v1/patients/dropdownOptions')
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

    const getTotalPatient = async () => {
        setIsLoading(true)
        try {
            const response = await api.get('/api/v1/patients/total')
            .then(response => {
                setIsLoading(false);
                return response;
            })
            .catch(error => {
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
        getPatientDropdownOptions,
        getTotalPatient,
    }
}
