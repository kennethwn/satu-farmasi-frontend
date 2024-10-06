import { useState } from "react";
import axios from "@/configs/axios/satufarmasi-service-axios";

export default function useExpenseMedicineAPI() {
    const [isLoading, setIsLoading] = useState(false);

    const GetAllMedicine = async (page, limit) => {
        setIsLoading(true);
        try {
            return await axios.get(`/api/v1/outputMedicines?page=${page}&limit=${limit}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const GetMedicineByParams = async (params) => {
        console.log("params: ", params);
        setIsLoading(true);
        try {
            return await axios.get(`/api/v1/outputMedicines?params=${params}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const GetMedicineById = async (id) => {
        setIsLoading(true);
        try {
            return await axios.get(`/api/v1/outputMedicines/${id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const CreateMedicine = async (data) => {
        console.log("create data: ", data);
        setIsLoading(true);
        try {
            return await axios.post("/api/v1/outputMedicines/", data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const EditMedicine = async (data) => {
        console.log("edit data: ", data);
        setIsLoading(true);
        try {
            return await axios.put(`/api/v1/outputMedicines/`, data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const DeleteMedicine = async (data) => {
        console.log("deleted: ", data)
        setIsLoading(true);
        try {
            data.medicineId = data.medicine.id;
            return await axios.delete(`/api/v1/outputMedicines/`, { data: data });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        GetAllMedicine,
        GetMedicineById,
        CreateMedicine,
        EditMedicine,
        DeleteMedicine,
        GetMedicineByParams,
    };
}
