import { useRouter } from 'next/router';
import api from "../../components/configs/axios/satufarmasi-service-axios"
import { useState } from 'react';

export default function usePharmacist() {
    const router = useRouter(); //👈 buat pindah halaman
    const [isLoading, setIsLoading] = useState(false);

    const addPharmacist = async (data) => {
        try {
            return await api.post("/api/v1/pharmacists/", { data })
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error;
                })
        } catch (error) {
            return error;
        }
    }

    return {
        addPharmacist,
    }
}
