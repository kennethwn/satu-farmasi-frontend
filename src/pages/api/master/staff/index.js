import axios from 'axios';
import React, { useState } from 'react'

export default function useStaffAPI() {
    const [isLoading, setIsLoading] = useState(false);

    const GetAllStaffByUserNik = async(nik) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/master/staff', {nik: nik})
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
        GetAllStaffByUserNik
    }
}
