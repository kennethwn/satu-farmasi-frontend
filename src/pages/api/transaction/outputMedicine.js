import { useState } from "react";
import axios from "@/configs/axios/satufarmasi-service-axios";

export default function useOutputMedicineAPI() {
    const [isLoading, setIsLoading] = useState(false);

    const GetAllMedicine = async (page, limit) => {
        setIsLoading(true);
        try {
            return await axios.get(
                `/api/v1/outputMedicines?page=${page}&limit=${limit}`,
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const GetMedicineByParams = async (params) => {
        setIsLoading(true);
        let query = "";
        if (params.q.length !== 0 && params.filter.length !== 0)
            query = `?q=${params.q}&filter=${params.filter}`;
        else if (params.q.length !== 0) query = `?q=${params.q}`;
        else if (params.filter.length !== 0) query = `?filter=${params.filter}`;
        try {
            return await axios.get(`/api/v1/outputMedicines${query}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const GetOutputMedicineById = async (id) => {
        try {
            return await axios.get(`/api/v1/outputMedicines/${id}`);
        } catch (error) {
            console.error(error);
        }
    };

    const GetMedicineById = async (id) => {
        setIsLoading(true);
        try {
            return await axios.get(`/api/v1/medicines/${id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const CreateMedicine = async (data) => {
        setIsLoading(true);
        try {
            return await axios.post("/api/v1/outputMedicines/", data);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const EditMedicine = async (data) => {
        setIsLoading(true);
        try {
            return await axios.put(`/api/v1/outputMedicines/`, data);
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false);
        }
    };

    const DeleteMedicine = async (data) => {
        setIsLoading(true);
        try {
            data.medicineId = data.medicine.id;
            return await axios.delete(`/api/v1/outputMedicines/`, {
                data: data,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const bulkCreate = async (data) => {
        setIsLoading(true);
        try {
            return await axios.post("/api/v1/outputMedicines/bulkCreate", {data});
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        GetAllMedicine,
        GetMedicineById,
        CreateMedicine,
        EditMedicine,
        DeleteMedicine,
        GetMedicineByParams,
        GetOutputMedicineById,
        bulkCreate,
    };
}
