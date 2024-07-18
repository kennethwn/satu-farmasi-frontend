import axios from 'axios';
import { useState } from 'react'

export default function useMedicineDropdownOption() {
    const [isLoading, setIsLoading] = useState(null);

    const getMedicineDropdownOptions = async() => {
        setIsLoading(true)
        try {
            const response = await axios.get('http://localhost:8000/api/v1/medicines/dropdownOptions')
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
        getMedicineDropdownOptions
    }
}
