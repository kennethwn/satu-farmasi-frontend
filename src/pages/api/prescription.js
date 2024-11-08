import { useRouter } from 'next/router';
import api from "../../configs/axios/satufarmasi-service-axios"
import { useState } from 'react';

export default function usePrescription() {
    const [isLoading, setIsLoading] = useState(false);

    const getAllPrescription = async (patientName, limit, page) => {
        setIsLoading(true)
        try {
            let response
            
            if (patientName !== "") {
                response = await api.get(`/api/v1/prescriptions?name=${patientName}&limit=${limit}&page=${page}`)
                .then((response) => {
                    setIsLoading(false)
                    return response;
                })
                .catch((error) => {
                    setIsLoading(false)
                    return error;
                })
            } else {
                response = await api.get(`/api/v1/prescriptions?limit=${limit}&page=${page}`)
                .then((response) => {
                    setIsLoading(false)
                    return response;
                })
                .catch((error) => {
                    setIsLoading(false)
                    return error;
                })
            }
            
            return response 
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

    const addNewPrescription = async (data) => {
        setIsLoading(true)
        try {
            const response = await api.post('/api/v1/prescriptions', {data})
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

    const updatePrescription = async (data) => {
        setIsLoading(true)
        try {
            const response = await api.put('/api/v1/prescriptions', {data})
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

    return {
        isLoading,
        getAllPrescription,
        getSearchedPrescription,
        addNewPrescription,
        getPrescriptionDetail,
        updatePrescription
    }
}
