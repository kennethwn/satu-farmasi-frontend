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

    const GetMedicineListById = async (page, limit, search, sortBy, sortMode) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/api/v1/medicines/summaryById?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortMode=${sortMode}`)
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

    const GetMedicineListByCode = async (page, limit, search, sortBy, sortMode) => {
        setIsLoading(true)
        try {
            const response = await axios.get(`/api/v1/medicines/summaryByCode?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortMode=${sortMode}`)
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

    const GetTotalNeedToRestockMedicine = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/v1/medicines/total/need-to-restock')
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
            return await axios.post('/api/v1/medicines/edit', data)
        } catch (error) {
            throw error.response.data;
        } finally {
            setIsLoading(false);
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
        GetMedicineListById,
        GetMedicineListByCode,
        GetTotalMedicine,
        GetTotalNeedToRestockMedicine,
        SearchMedicine,
        CreateMedicine,
        AddCurrentStock,
        CheckStock,
        CheckExpirationByDate,
        EditMedicine,
        DeleteMedicine
    }
}
