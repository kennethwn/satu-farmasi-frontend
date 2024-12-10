import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useState, useEffect } from "react";
import { z, ZodError } from "zod";
import { isRequiredEmail, isRequiredPhoneNumber, isRequiredString } from "@/helpers/validation";
import Button from "@/components/Button";
import Toaster from "@/components/Modal/Toaster";
import usePharmacy from "../api/pharmacy";
import { toast } from "react-toastify";
import { useUserContext } from "../api/context/UserContext";
import Input from "@/components/Input";

const pharmacySchema = z.object({
    name: isRequiredString(),
    pharmacyNum: isRequiredString(),
    address: isRequiredString(),
    phoneNum: isRequiredPhoneNumber(),
    email: isRequiredEmail()
});

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
    const [ errors, setErrors ] = useState({})

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

    const validateData = () => {
        try {
            setErrors({})
            pharmacySchema.parse(updatePharmacyInfo)
            setOpen({...open, submit: true})
        } catch (error) {
            if (error instanceof ZodError) {
                const newErrors = { ...errors };
                error.issues.forEach((issue) => {
                    if (issue.path.length > 0) {
                        const fieldName = issue.path.join(".");
                        newErrors[fieldName] = issue.message;
                    }
                });
                setErrors(newErrors);
            }
        }

    }

	const handleCloseEditMode = async () => {
		setUpdatePharmacyInfo(pharmacyInfo)
		setEditMode(false)
		setOpen({...open, cancel: false})
	}

	return (
		<Layout active="pharmacy" user={user}>
			<ContentLayout title="Informasi Apotek">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<label>Nama Apotek</label>
						<Input
							type="string"
							id="name"
							name="name"
							placeholder="Nama Farmasi"
							value={editMode ? updatePharmacyInfo.name : pharmacyInfo.name}
							disabled={!editMode}
                            error={errors.name}
							onChange={(e) => {
                                setUpdatePharmacyInfo({
                                    ...updatePharmacyInfo,
                                    name: e.target.value,
                                })
                                setErrors({
                                    ...errors,
                                    "name": "",
                                });
                            }}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label>Surat Izin Apotek (SIA)</label>
						<Input
							type="string"
							id="pharmacyNumber"
							name="pharmacynumber"
							placeholder="Nomor Farmasi (Surat Izin Apotek)"
							value={editMode ? updatePharmacyInfo.pharmacyNum : pharmacyInfo.pharmacyNum}
							disabled={!editMode}
                            error={errors.pharmacyNum}
							onChange={(e) => {
                                setUpdatePharmacyInfo({
                                    ...updatePharmacyInfo,
                                    pharmacyNum: e.target.value,
                                })
                                setErrors({
                                    ...errors,
                                    "pharmacyNum": "",
                                });
                            }}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label>Alamat</label>
						<Input
							type="string"
							id="address"
							name="address"
							placeholder="Alamat Farmasi"
							value={editMode ? updatePharmacyInfo.address : pharmacyInfo.address}
							disabled={!editMode}
                            error={errors.address}
							onChange={(e) => {
                                setUpdatePharmacyInfo({
                                    ...updatePharmacyInfo,
                                    address: e.target.value,
                                })
                                setErrors({
                                    ...errors,
                                    "address": "",
                                });
                            }}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label>No Handphone</label>
						<Input
							type="string"
							id="phoneNum"
							name="phoneNum"
							placeholder="Nomor Telepon Farmasi"
							value={editMode ? updatePharmacyInfo.phoneNum : pharmacyInfo.phoneNum}
							disabled={!editMode}
                            error={errors.phoneNum}
							onChange={(e) => {
                                setUpdatePharmacyInfo({
                                    ...updatePharmacyInfo,
                                    phoneNum: e.target.value,
							    })
                                setErrors({
                                    ...errors,
                                    "phoneNum": "",
                                });
                            }}
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
                            error={errors.email}
							onChange={(e) => {
                                setUpdatePharmacyInfo({
                                    ...updatePharmacyInfo,
                                    email: e.target.value,
                                })
                                setErrors({
                                    ...errors,
                                    "email": "",
                                });
                            }}
						/>
					</div>
					<div className="flex flex-end justify-end gap-4">
						{editMode ?
							(
								<>
									<Button 
										type="button" 
										appearance="danger" 
										onClick={(e) => setOpen({...open, cancel: true})}
									>
										Batalkan
									</Button>
									<Button 
										type="button" 
										appearance="primary" 
										onClick={validateData}
									>
										Simpan
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
								Ubah
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
                title={"Konfirmasi"}
				btnText="Konfirmasi"
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
                title={"Konfirmasi"}
				btnText="Konfirmasi"
				isLoading={isLoading}
				onClick={() => handleUpdatePharmacyInfo()}
			/>
		</Layout>
	);
}
