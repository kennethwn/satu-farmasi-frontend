import api from "../../configs/axios/satufarmasi-service-axios"
import { useState } from 'react';

export default function usePrescription() {
    const [isLoading, setIsLoading] = useState(false);

    const getAllPrescription = async (patientName, limit, page, filterStatus) => {
        setIsLoading(true)
        try {
            return await api.get(`/api/v1/prescriptions?name=${patientName}&status=${filterStatus}&limit=${limit}&page=${page}`)
        } catch (error) {
            throw error.response.data.errors
        } finally {
            setIsLoading(false)
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

    const addNewPrescription = async (data) => {
        setIsLoading(true)
        try {
            return  await api.post('/api/v1/prescriptions', {data})
        } catch (error) {
            throw error.response.data.errors
        } finally {
            setIsLoading(false)
        }
    }

    const getPrescriptionDetail = async (prescriptionId) => {
        setIsLoading(true)
        try {
            const response = await api.get('/api/v1/prescriptions/' + prescriptionId)
            .then((response) => {
                setIsLoading(false);
                return response;
            })
            .catch((error) => {
                setIsLoading(false);
                return error;
            })
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    const getMostSalesMedicineByPrescription = async (data) => {
        setIsLoading(true)
        try {
            const response = await api.post('/api/v1/prescriptions/most-sales-medicines', data)
            .then((response) => {
                setIsLoading(false);
                return response;
            })
            .catch((error) => {
                setIsLoading(false);
                return error;
            })
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    const updatePrescription = async (data) => {
        setIsLoading(true)
        try {
            return await api.put('/api/v1/prescriptions', {data})
        } catch (error) {
            throw error.response.data.errors
        } finally {
            setIsLoading(false)
        }
    }

    const cancelPrescription = async (data) => {
        setIsLoading(true)
        try {
            return await api.put('/api/v1/prescriptions/cancel/' + data)
        } catch (error) {
            throw error.response.data.errors
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        getAllPrescription,
        getSearchedPrescription,
        addNewPrescription,
        getPrescriptionDetail,
        getMostSalesMedicineByPrescription,
        cancelPrescription,
        updatePrescription
    }
}
