import { useState } from "react";
import axios from "@/configs/axios/satufarmasi-service-axios";

export default function useTransaction() {
    const [isLoading, setIsLoading] = useState(false);

    const getAllTransaction = async (patientName, limit, page,filterStatus) => {
        setIsLoading(true);
        try {
            let response
        
            if (patientName !== "") {
                response = await axios.get(`/api/v1/transactions/_summary?name=${patientName}&limit=${limit}&page=${page}&status=${filterStatus}`)
                .then((response) => {
                    setIsLoading(false);
                    return response;
                })
                .catch((error) => {
                    setIsLoading(false);
                    return error;
                })
            } else { 
                response = await axios.get(`/api/v1/transactions/_summary?limit=${limit}&page=${page}&status=${filterStatus}`)
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

    const getOnProgressAndWaitingPaymentTransaction = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/v1/transactions/_status/on-progress-waiting-payment`)
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

    const getTransactionProfitByDate = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/v1/transactions/profit/date`, data)
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

    const getAnnualTransactionRecap = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/v1/transactions/annual-recap`, data)
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

    const createTransaction = async (data) => {
        setIsLoading(true);
        try {
            console.log('#createTransaction: ', {data})
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

    const confirmPayment = async (data) => {
        try {
            const response = await axios.post(`/api/v1/transactions/_pay`, {data})
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
            console.error(error)
        }
    }

    const finishTransaction = async (data) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/v1/transactions/_finish', {data})
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


    const publishNotification = async (data) => {
        setIsLoading(true)
        try {
            console.log("publish data: ", data)
            const response = await axios.post('/api/v1/transactions/_publish', data)
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
        getOnProgressAndWaitingPaymentTransaction,
        getTransactionProfitByDate,
        getAnnualTransactionRecap,
        createTransaction,
        getTransactionDetail,
        confirmPayment,
        finishTransaction,
        publishNotification
    };
}
