import { useRouter } from 'next/router';
import api from "../../configs/axios/satufarmasi-service-axios"
import { useState } from 'react';
import { convertToTimestampString } from '@/helpers/dayHelper';

export default function useDoctor() {
	const router = useRouter(); //👈 buat pindah halaman
	const [isLoading, setIsLoading] = useState(false);

	const addDoctor = async (data) => {
		let { email, password, nik, firstName, lastName, phoneNum, dob, role, specialist } = data;
		dob = convertToTimestampString(dob);
		try {
			return await api.post("/api/v1/doctors/", { email, password, nik, firstName, lastName, phoneNum, dob, role, specialist });
		} catch (error) {
            console.log("err in doctor: ", error)
			throw error.response.data.errors;
		}
	}

	return {
		router,
		addDoctor,
	}
}
