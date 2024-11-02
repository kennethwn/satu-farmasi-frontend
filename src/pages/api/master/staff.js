import axios from "@/configs/axios/satufarmasi-service-axios"
import { useState } from 'react'

export default function useStaffAPI() {
	const [isLoading, setIsLoading] = useState(false);

	const GetAllStaff = async (page, limit, param, filter) => {
		setIsLoading(true)
		try {
			return await axios.get(`/api/v2/admins/staffs?param=${param}&page=${page}&limit=${limit}&filter=${filter}`)
		} catch (error) {
			throw error.response.data.errors;
		} finally {
			setIsLoading(false);
		}
	}

	const GetStaffByNik = async (nik) => {
		setIsLoading(true)
		try {
			return await axios.post(`/api/v2/admins/staff/nik`, { nik: nik })
		} catch (error) {
			throw error.response.data.errors;
		} finally {
			setIsLoading(false);
		}
	}

	const EditAdmin = async (data) => {
		setIsLoading(true)
		try {
			return await axios.put(`/api/v2/admins/staff/edit/admin`, data)
		} catch (error) {
			throw error.response.data.errors;
		} finally {
			setIsLoading(false);
		}
	}

	const EditDoctor = async (data) => {
		setIsLoading(true)
		try {
			return await axios.put(`/api/v2/admins/staff/edit/doctor`, data)
		} catch (error) {
			throw error.response.data.errors;
		} finally {
			setIsLoading(false);
		}
	}

	const EditPharmacist = async (data) => {
		setIsLoading(true)
		try {
			return await axios.put(`/api/v2/admins/staff/edit/pharmacist`, data)
		} catch (error) {
			throw error.response.data.errors;
		} finally {
			setIsLoading(false);
		}
	}

	return {
		isLoading,
		GetAllStaff,
		GetStaffByNik,
		EditAdmin,
		EditDoctor,
		EditPharmacist,
	}
}
