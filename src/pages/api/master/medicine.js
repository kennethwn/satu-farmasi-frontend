import axios from "@/configs/axios/satufarmasi-service-axios"
import { useState } from "react";

export default function useMedicineAPI() {
    const [isLoading, setIsLoading] = useState(false);

    const GetMedicineDropdownList = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/v1/medicines/dropdownOptions`)
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

    const GetAllMedicines = async (page, limit) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/api/v1/medicines?page=${page}&limit=${limit}`)
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

    const GetTotalMedicine = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/v1/medicines/total')
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

    const SearchMedicine = async (page, limit, parameter) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/api/v1/medicines?page=${page}&limit=${limit}&parameter=${parameter}`)
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

    const CreateMedicine = async (data) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/v1/medicines', data)
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

    const AddCurrentStock = async (data) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/v1/medicines/add-stock', data)
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

    const CheckStock = async (data) => {
        try {
            const response = await axios.post('/api/v1/medicines/check-stock', data)
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

    const CheckExpirationByDate = async (date) => {
        try {
            const response = await axios.post('/api/v1/medicines/check-expiration', date)
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

    const EditMedicine = async (data) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/v1/medicines/edit', data)
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

    const DeleteMedicine = async (id) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/v1/medicines/delete', id)
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
        GetMedicineDropdownList,
        GetAllMedicines,
        GetTotalMedicine,
        SearchMedicine,
        CreateMedicine,
        AddCurrentStock,
        CheckStock,
        CheckExpirationByDate,
        EditMedicine,
        DeleteMedicine
    }
}