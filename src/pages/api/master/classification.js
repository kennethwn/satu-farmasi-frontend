import { useState } from "react";
import axios from "@/configs/axios/satufarmasi-service-axios"

export default function useClassificationsAPI() {
    const [isLoading, setIsLoading] = useState(false);

    const GetAllClassification = async (page, limit) => {
        setIsLoading(true)
        try {
            return await axios.get(`/api/v1/classifications?page=${page}&limit=${limit}`)
        } catch (error) {
            console.error(error);
        } finally {
          setIsLoading(false);
        }
    }

    const GetClassificationByLabel = async (label) => {
        setIsLoading(true)
        try {
            return await axios.get(`/api/v1/classifications?label=${label}`)
        } catch (error) {
            console.error(error);
        } finally {
          setIsLoading(false);
        }
    }

    const CreateClassification = async (data) => {
        setIsLoading(true)
        try {
            return await axios.post('/api/v1/classifications/', data)
        } catch (error) {
            console.error(error);
        } finally {
          setIsLoading(false);
        }
    }

    const EditClassification = async (data) => {
      console.log(data)
        setIsLoading(true)
        try {
           return await axios.put('/api/v1/classifications/', data)
        } catch (error) {
            console.error(error);
        } finally {
          setIsLoading(false);
        }
    }

    const DeleteClassification = async (data) => {
        setIsLoading(true)
        try {
           return await axios.delete('/api/v1/classifications/', { data: data })
        } catch (error) {
            console.error(error);
        } finally {
          setIsLoading(false);
        }
    }

    return {
        isLoading,
        GetAllClassification,
        GetClassificationByLabel,
        CreateClassification,
        EditClassification,
        DeleteClassification
    }
}
