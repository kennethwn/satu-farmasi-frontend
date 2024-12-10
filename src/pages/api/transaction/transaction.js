import { useState } from "react";
import axios from "@/configs/axios/satufarmasi-service-axios";

export default function useTransaction() {
    const [isLoading, setIsLoading] = useState(false);

    const getAllTransaction = async (patientName, limit, page) => {
        setIsLoading(true);
        try {
            let response
        
            if (patientName !== "") {
                response = await axios.get(`/api/v1/transactions/_summary?name=${patientName}&limit=${limit}&page=${page}`)
                .then((response) => {
                    setIsLoading(false);
                    return response;
                })
                .catch((error) => {
                    setIsLoading(false);
                    return error;
                })
            } else { 
                response = await axios.get(`/api/v1/transactions/_summary?limit=${limit}&page=${page}`)
                .then((response) => {
                    setIsLoading(false);
                    return response;
                })
                .catch((error) => {
                    setIsLoading(false);
                    return error;
                })
            }

            return response
        } catch (error) {
            console.error(error);
        }
    }

    const getTransactionDetail = async (transactionId) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/api/v1/transactions/` + transactionId)
            .then((response) => {
                setIsLoading(false)
                return response
            })
            .catch((error) => {
                setIsLoading(false)
                return error
            })
            return response
        } catch (error) {
            console.error(error)
        }
    }

    const createTransaction = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/v1/transactions`, {data})
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

    const publishNotification = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/v1/transactions/_publish', {data: true})
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
        getAllTransaction,
        createTransaction,
        getTransactionDetail,
        publishNotification
    };
}
