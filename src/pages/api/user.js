// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import api from "../../configs/axios/satufarmasi-service-axios";
import { useEffect, useState } from "react";
import { useUserContext } from "./context/UserContext";
import usePharmacy from "../api/pharmacy";

export default function useUser() {
    const router = useRouter(); //👈 buat pindah halaman
    const [isLoading, setIsLoading] = useState(false);
    const { user, setUser } = useUserContext();
    const { getPharmacyInfo} = usePharmacy()

    const getUser = async (data) => {
        const { email, password, isRemember } = data;

        try {
            const response = await api.post("/api/v1/users/", {
                email,
                password,
                isRemember,
            });
            const fullName = response.data.firstName + " " + response.data.lastName;
            setUser({ id: response.data.id, name: fullName, email: response.data.email, role: response.data.role, sipaNumber: response.data.sipaNumber });
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
