import axios from "@/configs/axios/satufarmasi-service-axios"
import { useState } from 'react'

export default function useStaffAPI() {
    const [isLoading, setIsLoading] = useState(false);

    const GetAllStaff = async(page, limit, param, filter) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/api/v2/admins/staffs?param=${param}&page=${page}&limit=${limit}&filter=${filter}`)
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
            const response = await axios.post(`/api/v2/admins/staff/nik`, {nik: nik})
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

    const EditAdmin = async(data) => {
        setIsLoading(true)
        try {
            const response = await axios.put(`/api/v2/admins/staff/edit/admin`, data)
            .then((response) => {
                setIsLoading(false);
                return response;
            })
            .catch((error) => {
				console.log("error", error)
                setIsLoading(false);
                return error;
            })
            return response
        } catch (error) {
            console.error(error);
        }
    }

    const EditDoctor = async(data) => {
        setIsLoading(true)
        try {
            const response = await axios.put(`/api/v2/admins/staff/edit/doctor`, data)
            .then((response) => {
                setIsLoading(false);
                return response;
            })
            .catch((error) => {
				console.log("error", error)
                setIsLoading(false);
                return error;
            })
            return response
        } catch (error) {
            console.error(error);
        }
    }

    const EditPharmacist = async(data) => {
        setIsLoading(true)
        try {
            const response = await axios.put(`/api/v2/admins/staff/edit/pharmacist`, data)
            .then((response) => {
                setIsLoading(false);
                return response;
            })
            .catch((error) => {
				console.log("error", error)
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
		EditAdmin,
		EditDoctor,
		EditPharmacist,
    }
}
