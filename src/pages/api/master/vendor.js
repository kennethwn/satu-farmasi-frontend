import { useState } from "react";
import axios from "@/configs/axios/satufarmasi-service-axios";

export default function useVendorAPI() {
    const [isLoading, setIsLoading] = useState(false);

    const GetAllVendor = async (page, limit) => {
        setIsLoading(true);
        try {
            return await axios.get(
                `/api/v1/vendors?page=${page}&limit=${limit}`,
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const GetVendorById = async (id) => {
        setIsLoading(true);
        try {
            return await axios.get(`/api/v1/vendors/${id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const GetVendorByLabel = async (label) => {
        setIsLoading(true);
        try {
            return await axios.get(`/api/v1/vendors?label=${label}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const GetAllActiveVendor = async () => {
        setIsLoading(true);
        try {
            return await axios.get(`/api/v1/vendors/active`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const CreateVendor = async (data) => {
        setIsLoading(true);
        try {
            return await axios.post("/api/v1/vendors/", data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const EditVendor = async (data) => {
        console.log(data);
        setIsLoading(true);
        try {
            return await axios.put(`/api/v1/vendors/${data.id}`, data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const DeleteVendor = async (data) => {
        setIsLoading(true);
        try {
            return await axios.delete(`/api/v1/vendors/${data.id}`, {
                data: data,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        GetAllVendor,
        GetVendorById,
        GetVendorByLabel,
        GetAllActiveVendor,
        CreateVendor,
        EditVendor,
        DeleteVendor,
    };
}
