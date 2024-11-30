import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { isRequiredString } from "@/helpers/validation";
import Button from "@/components/Button";
import Toaster from "@/components/Modal/Toaster";
import usePharmacy from "../api/pharmacy";
import { toast } from "react-toastify";
import { useUserContext } from "../api/context/UserContext";
import Input from "@/components/Input";

const classificationSchema = z.object({
	label: isRequiredString(),
})

export default function index() {
	const { user } = useUserContext();
	const {isLoading, getPharmacyInfo, updatePharmacy} = usePharmacy()
	const [ open, setOpen ] = useState({
		cancel: false,
		submit: false
	})
	const [editMode, setEditMode] = useState(false)
	const pharmacyInfoFields = {
		name: "",
		pharmacyNum: "",
		address: "",
		phoneNum: "",
		email: ""
	}
	const [pharmacyInfo, setPharmacyInfo] = useState(pharmacyInfoFields)
	const [updatePharmacyInfo, setUpdatePharmacyInfo] = useState(pharmacyInfoFields)

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await getPharmacyInfo();
				if (res.code !== 200) {
					toast.error(res.message, { autoClose: 2000, position: "top-right" });
					return;
				}
				if (!res.data) {
					const placeHolder = {
						name: "Pharmacy name not set",
						pharmacyNum: "Pharmacy number (SIA) not set",
						address: "Pharmacy address not set",
						phoneNum: "Pharmacy phone number not set",
						email: "Pharmacy email not set"
					}
					setPharmacyInfo(placeHolder)
				} else {
					setPharmacyInfo(res.data)
					setUpdatePharmacyInfo(res.data)
				}
			} catch (error) {
				console.error(error);
			}
		}
		fetchData()
	}, [])

	const handleUpdatePharmacyInfo = async () => {
		const res = await updatePharmacy(updatePharmacyInfo);
		if (res.code !== 200) {
			console.log("resError: ", res)
			toast.error(res?.response?.data?.message, { autoClose: 2000, position: "top-right" });
			setOpen({ ...open, submit: false })
			return;
		}
		toast.success(res.message, { autoClose: 2000, position: "top-right" })
		setPharmacyInfo(updatePharmacyInfo)
		setEditMode(false)
		setOpen({...open, submit: false})
	}

	const handleCloseEditMode = async () => {
		setUpdatePharmacyInfo(pharmacyInfo)
		setEditMode(false)
		setOpen({...open, cancel: false})
	}

	return (
		<Layout active="pharmacy" user={user}>
			<ContentLayout title="Informasi Farmasi">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<label>Pharmacy Name</label>
						<Input
							type="string"
							id="name"
							name="name"
							placeholder="Nama Farmasi"
							value={editMode ? updatePharmacyInfo.name : pharmacyInfo.name}
							disabled={!editMode}
							onChange={(e) => setUpdatePharmacyInfo({
								...updatePharmacyInfo,
								name: e.target.value,
							})}
							// onChange={(e) => {
							// 	setUpdatePharmacyInfo(...updatePharmacyInfo, name: e.target.value)
							// 	// setErrors({
							// 	// 	...errors,
							// 	// 	[`prescription.medicineList.${index}.quantity`]:
							// 	// 		"",
							// 	// });
							// }}
							// error={
							// 	errors[
							// 	`prescription.medicineList.${index}.quantity`
							// 	]
							// }
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label>Pharmacy Number (Surat Izin Apotek / SIA)</label>
						<Input
							type="string"
							id="pharmacyNumber"
							name="pharmacyNumber"
							placeholder="Nomor Farmasi (Surat Izin Apotek)"
							value={editMode ? updatePharmacyInfo.pharmacyNum : pharmacyInfo.pharmacyNum}
							disabled={!editMode}
							onChange={(e) => setUpdatePharmacyInfo({
								...updatePharmacyInfo,
								pharmacyNum: e.target.value,
							})}
							// onChange={(e) => {
							// 	handleMedicineQuantity(
							// 		index,
							// 		e.target.value,
							// 	);
							// 	setErrors({
							// 		...errors,
							// 		[`prescription.medicineList.${index}.quantity`]:
							// 			"",
							// 	});
							// }}
							// error={
							// 	errors[
							// 	`prescription.medicineList.${index}.quantity`
							// 	]
							// }
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label>Address</label>
						<Input
							type="string"
							id="address"
							name="address"
							placeholder="Alamat Farmasi"
							value={editMode ? updatePharmacyInfo.address : pharmacyInfo.address}
							disabled={!editMode}
							onChange={(e) => setUpdatePharmacyInfo({
								...updatePharmacyInfo,
								address: e.target.value,
							})}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label>Phone Number</label>
						<Input
							type="string"
							id="phoneNum"
							name="phoneNum"
							placeholder="Nomor Telepon Farmasi"
							value={editMode ? updatePharmacyInfo.phoneNum : pharmacyInfo.phoneNum}
							disabled={!editMode}
							onChange={(e) => setUpdatePharmacyInfo({
								...updatePharmacyInfo,
								phoneNum: e.target.value,
							})}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label>Email</label>
						<Input
							type="string"
							id="email"
							name="email"
							placeholder="Email Farmasi"
							value={editMode ? updatePharmacyInfo.email : pharmacyInfo.email}
							disabled={!editMode}
							onChange={(e) => setUpdatePharmacyInfo({
								...updatePharmacyInfo,
								email: e.target.value,
							})}
						/>
					</div>
					<div className="flex flex-end justify-end gap-4">
						{editMode ?
							(
								<>
									<Button 
										type="button" 
										appearance="primary" 
										onClick={(e) => setOpen({...open, cancel: true})}
									>
										Cancel
									</Button>
									<Button 
										type="button" 
										appearance="primary" 
										onClick={(e) =>  setOpen({...open, submit: true})}
									>
										Submit
									</Button>
								</>
							)
						:
							(
							<Button 
								type="button" 
								appearance="primary" 
								onClick={(e) => setEditMode(true)}
							>
								Edit
							</Button>
							)
						}
					</div>
				</div>
			</ContentLayout>

			<Toaster
				type="warning"
				open={open.cancel}
				onClose={() => setOpen({ ...open, cancel: false })}
				body={
					<>
						Apakah anda yakin untuk membatalkan perubahan?
					</>
				}
				btnText="Confirm"
				isLoading={isLoading}
				onClick={() => handleCloseEditMode()}
			/>

			<Toaster
				type="primary"
				open={open.submit}
				onClose={() => setOpen({ ...open, submit: false })}
				body={
					<>
						Apakah anda yakin untuk finalisasi perubahan?
					</>
				}
				btnText="Confirm"
				isLoading={isLoading}
				onClick={() => handleUpdatePharmacyInfo()}
			/>
		</Layout>
	);
}
