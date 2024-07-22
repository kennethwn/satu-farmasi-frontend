import axios from '@/configs/axios/satufarmasi-service-axios';
import React, { useState } from 'react'

export default function useStaffAPI() {
    const [isLoading, setIsLoading] = useState(false);

    const GetAllStaff = async() => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/v1/admins/staffs')
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

    const GetStaffByNik = async(nik) => {
        setIsLoading(true)
        try {
            const response = await axios.post(`/api/v1/admins/staff/nik`, {nik: nik})
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

    const EditStaff = async(data) => {
        setIsLoading(true)
        try {
            const response = await axios.post(`/api/v1/admins/staff/edit`, data)
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
        GetAllStaff,
        GetStaffByNik,
        EditStaff
    }
}
