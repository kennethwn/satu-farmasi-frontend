import { useRouter } from "next/router";
import api from "../../configs/axios/satufarmasi-service-axios";
import { useEffect, useState } from "react";
import { useUserContext } from "./context/UserContext";

export default function useUser() {
    const router = useRouter(); //👈 buat pindah halaman
    const [isLoading, setIsLoading] = useState(false);
    const { user, setUser } = useUserContext();

    const getUser = async (data) => {
        const { email, password, isRemember } = data;

        try {
            const response = await api.post("/api/v1/users/", {
                email,
                password,
                isRemember,
            });
            setUser(response);
            const fullName = response.data.firstName + " " + response.data.lastName;
            setUser({ name: fullName, role: response.data.role });
            return response;
        } catch (error) {
            throw error.response.data;
        }
    };

    const deleteUser = async () => {
        try {
            return await api
                .delete("/api/v1/users/")
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return {
                        status: error.response.status,
                        message: error.response.data.message,
                    };
                });
        } catch (error) {
            throw new Error(error);
        }
    };

    return {
        router,
        isLoading,
        user,
        getUser,
        deleteUser,
    };
}
