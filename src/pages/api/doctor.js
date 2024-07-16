import { useRouter } from 'next/router';
import api from "../../components/configs/axios/satufarmasi-service-axios"
import { useState } from 'react';

export default function useDoctor() {
    const router = useRouter(); //👈 buat pindah halaman
    const [isLoading, setIsLoading] = useState(false);

    // TODO: add logic for login
    const addDoctor = async (data) => {
        try {
            return await api.post("/api/v1/doctors/", { data })
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

    // TODO: add logic for fetching logged user

    // TODO: add logic for update user

    // TODO: add logic for logout

    return {
        addDoctor,
    }
}
