import { useRouter } from 'next/router';
import api from "../../components/configs/axios/satufarmasi-service-axios"
import { useState } from 'react';
import { convertToTimestampString } from '@/helpers/dayHelper';

export default function usePharmacist() {
    const router = useRouter(); //👈 buat pindah halaman
    const [isLoading, setIsLoading] = useState(false);

    const addPharmacist = async (data) => {
        let { email, password, nik, firstName, lastName, phoneNum, dob, role } = data;
        dob = convertToTimestampString(dob);
        try {
            return await api.post("/api/v1/pharmacists/", { email, password, nik, firstName, lastName, phoneNum, dob, role })
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
