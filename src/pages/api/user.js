import { useRouter } from 'next/router';
import api from "../../components/configs/axios/satufarmasi-service-axios"
import { useState } from 'react';

export default function useUser() {
    const router = useRouter(); //👈 buat pindah halaman
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);

    // TODO: add logic for login
    const getUser = async (data) => {
        const { email, password } = data;
        try {
            return await api.post("/api/v1/users/", { email, password })
                .then((response) => {
                    setUser(response)
                    return response.token;
                })
                .catch((error) => {
                    return { status: error.response.status, message: error.response.data.message};
                })
        } catch (error) {
            throw new Error(error);
        }
    }

    // TODO: add logic for fetching logged user
    const deleteUser = async () => {
        try {
            return await api.delete("/api/v1/users/")
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return { status: error.response.status, message: error.response.data.message};
                })
        } catch (error) {
            throw new Error(error);
        }
    }

    // TODO: add logic for update user

    // TODO: add logic for logout

    return {
        isLoading,
        user,
        getUser,
        deleteUser,
    }
}
