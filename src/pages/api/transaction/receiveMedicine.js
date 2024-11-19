import { useState } from "react";
import axios from "@/configs/axios/satufarmasi-service-axios";

export default function useReceiveMedicineAPI() {
    const [isLoading, setIsLoading] = useState(false);

    const GetAllReceiveMedicines = async (page, limit) => {
        try {
            const response = await axios.get(`/api/v1/receiveMedicines?page=${page}&limit=${limit}`)
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

    const SearchReceiveMedicine = async (data) => {
        try {
            const response = await axios.get(`/api/v1/receiveMedicines?page=${page}&limit=${limit}&parameter=${parameter}`, data)
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

    const CreateReceiveMedicine = async (data) => {
        try {
            const response = await axios.post(`/api/v1/receiveMedicines`, data)
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
        GetAllReceiveMedicines,
        SearchReceiveMedicine,
        CreateReceiveMedicine
    }
}