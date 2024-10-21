import Button from "@/components/Button";
import InputField from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import Select from "@/components/Select";
import { useUserContext } from "@/pages/api/context/UserContext";
import useGenericAPI from "@/pages/api/master/generic";
import useMedicineAPI from "@/pages/api/master/medicine";
import usePackagingAPI from "@/pages/api/master/packaging";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MedicineClassificationForm from "@/components/DynamicForms/MedicineClassificationForm";
import { SelectPicker } from "rsuite";
import { z, ZodError } from "zod";
import { isRequiredNumber, isRequiredString } from "@/helpers/validation";
import Text from "@/components/Text";

const medicineSchema = z.object({
	name: isRequiredString(),
	merk: isRequiredString(),
	price: isRequiredNumber(),
	currStock: isRequiredNumber(),
	minStock: isRequiredNumber(),
	maxStock: isRequiredNumber(),
	genericName: isRequiredString(),
	packaging: isRequiredString(),
	unitOfMeasure: isRequiredString(),
	sideEffect: isRequiredString(),
}).refine(data => data.minStock < data.maxStock, {
	message: "Minimum stock must be less than maximum stock",
	path: ["minStock"],
}).refine(data => data.maxStock > data.minStock, {
	message: "Maximum stock must be greater than minimum stock",
	path: ["maxStock"],
}).refine(data => data.currStock >= data.minStock && data.currStock <= data.maxStock, {
	message: "Current stock must be between minimum stock and maximum stock",
	path: ["currStock"],
})

export default function Index() {
	const router = useRouter();
	const id = router.query.id;
	const { user } = useUserContext();
	const { isLoading, EditMedicine, SearchMedicine } = useMedicineAPI();
	const { GetPackagingDropdown } = usePackagingAPI();
	const { GetGenericDropdown } = useGenericAPI();

	const [input, setInput] = useState({});
	const [errors, setErrors] = useState({});
	const [packagings, setPackagings] = useState([]);
	const [generics, setGenerics] = useState([]);
	const [formFields, setFormFields] = useState([{ id: 0, label: '', value: '' }]);
	const unitOfMeasure = [
		{ id: 1, label: 'MILILITER', value: 'MILILITER' },
		{ id: 2, label: 'MILIGRAM', value: 'MILIGRAM' },
		{ id: 3, label: 'GRAM', value: 'GRAM' },
		{ id: 4, label: 'LITER', value: 'LITER' },
		{ id: 5, label: 'GROS', value: 'GROS' },
		{ id: 6, label: 'KODI', value: 'KODI' },
		{ id: 7, label: 'RIM', value: 'RIM' },
		{ id: 8, label: 'PCS', value: 'PCS' },
	];

	const handleFormFields = (value) => {
		setFormFields(value);
	}

	const handleFetchMedicineByCode = async () => {
		try {
			const res = await SearchMedicine(1, 1, id);
			if (res.code !== 200) {
				toast.error(res.message, { autoClose: 2000, position: "top-center" });
				return;
			}
			setInput(res?.data?.results[0]);

			let classificationForm = [];
			res.data.results[0].classifications.forEach((item, index) => {
				let data = { id: 0, label: '', value: '' };
				data['id'] = item.classification.id;
				data['label'] = item.classification.label;
				data['value'] = item.classification.value;
				classificationForm.push(data);
			})
			setFormFields(classificationForm);
		} catch (error) {
			console.error(error);
		}
	}

	const handleFetchPackagingDropdown = async () => {
		try {
			const res = await GetPackagingDropdown();
			if (res.code !== 200) {
				toast.error(res.message, { autoClose: 2000, position: "top-center" });
				setPackagings([]);
				return;
			}
			setPackagings(res.data);
		} catch (error) {
			console.error(error);
		}
	}

	const handleFetchGenericDropdown = async () => {
		try {
			const res = await GetGenericDropdown();
			if (res.code !== 200) {
				toast.error(res.message, { autoClose: 2000, position: "top-center" });
				setGenerics([]);
				return;
			}
			setGenerics(res.data);
		} catch (error) {
			console.error(error);
		}
	}

	const handleSubmit = async () => {
		try {
			let classifications = [];
			input?.classifications?.map((item, index) => {
				let temp = { classificationId: 0, medicineId: 0 };
				temp['classificationId'] = item.classification.id;
				temp['medicineId'] = input.id;
				classifications.push(temp);
			})

			const payload = {
				id: input.id,
				code: input.code,
				name: input.name,
				merk: input.merk,
				description: input.description,
				unitOfMeasure: input.unitOfMeasure,
				price: Number(input.price),
				expiredDate: input.expiredDate,
				currStock: Number(input.currStock),
				minStock: Number(input.minStock),
				maxStock: Number(input.maxStock),
				genericNameId: Number(input.genericName) || Number(input.genericName.id),
				packagingId: input.packaging.id,
				sideEffect: input.sideEffect,
				classificationList: classifications,
				is_active: input.is_active,
				created_at: input.created_at,
				updated_at: input.updated_at
			}

			setErrors({});
			medicineSchema.parse({ ...payload, genericName: input.genericName.label, packaging: input.packaging.label });
			const res = await EditMedicine(payload);
			if (res.code !== 200) {
				toast.error(res.message, { autoClose: 2000, position: "top-center" });
				return;
			}
			toast.success(res.message, { autoClose: 2000, position: "top-center" });
			router.push("/master/medicine");
		} catch (error) {
			if (error instanceof ZodError) {
				const newErrors = { ...errors };
				error.issues.forEach((issue) => {
					if (issue.path.length > 0) {
						const fieldName = issue.path[0];
						newErrors[fieldName] = issue.message;
					}
				});
				setErrors(newErrors);
			}
		}
	}

	useEffect(() => {
		async function fetchData() {
			await handleFetchMedicineByCode();
			await handleFetchPackagingDropdown();
			await handleFetchGenericDropdown();
		}
		if (router.isReady) {
			fetchData();
		}
	}, [id, router]);

	return (
		<Layout active="master-medicine" user={user}>
			<ContentLayout title="Edit Obat" type="child" backpageUrl="/master/medicine">
				<form id="form">
					<div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
						<div className="sm:col-span-6">
							<div className="mt-2">
								{isLoading ?
									<InputField
										type="text"
										id="medicine_name"
										name="medicine_name"
										disabled={true}
										label="Nama Obat"
										placeholder="nama obat"
										value={input?.name}
									/>
									:
									<InputField
										type="text"
										id="medicine_name"
										name="medicine_name"
										onChange={e => {
											setInput({ ...input, name: e.target.value });
											setErrors({ ...errors, "name": "" });
										}}
										label="Nama Obat"
										placeholder="nama obat"
										error={errors['name']}
										value={input?.name}
									/>
								}
							</div>
						</div>
						<div className="sm:col-span-6">
							<div className="mt-2">
								{isLoading ?
									<InputField
										type="text"
										id="merk"
										name="merk"
										label="Merek"
										disabled={true}
										placeholder="merek"
										value={input?.merk}
									/>
									:
									<InputField
										type="text"
										id="merk"
										name="merk"
										label="Merek"
										onChange={e => {
											setInput({ ...input, merk: e.target.value });
											setErrors({ ...errors, "merk": "" });
										}}
										placeholder="merek"
										error={errors['merk']}
										value={input?.merk}
									/>
								}
							</div>
						</div>
						<div className="sm:col-span-6">
							<div className="mt-2">
								{isLoading ?
									<InputField
										className="sm:leading-6 px-16"
										type="number"
										id="price"
										name="price"
										disabled={true}
										placeholder="0"
										label="Harga Jual Obat"
										value={input?.price}
										currency={true}
									/>
									:
									<InputField
										className="sm:leading-6 px-16"
										type="number"
										id="price"
										name="price"
										onChange={e => {
											setInput({ ...input, price: e.target.value })
											setErrors({ ...errors, "price": "" });
										}}
										placeholder="0"
										label="Harga Jual Obat"
										value={input?.price}
										error={errors['price']}
										currency={true}
									/>
								}
							</div>
						</div>
						<div className="sm:col-span-2">
							<div className="mt-2">
								{isLoading ?
									<InputField
										type="number"
										id="currStock"
										name="currStock"
										placeholder="0"
										label="Stok Sekarang"
										value={input?.currStock}
										disabled={true}
									/>
									:
									<InputField
										type="number"
										id="currStock"
										name="currStock"
										placeholder="0"
										label="Stok Sekarang"
										value={input?.currStock}
										error={errors['currStock']}
										onChange={e => {
											setInput({ ...input, currStock: parseInt(e.target.value) })
											setErrors({ ...errors, "currStock": "" });
										}}
									/>
								}
							</div>
						</div>
						<div className="sm:col-span-2">
							<div className="mt-2">
								{isLoading ?
									<InputField
										type="number"
										id="minStock"
										name="minStock"
										placeholder="0"
										label="Stok Minimum"
										value={input?.minStock}
										disabled={true}
									/>
									:
									<InputField
										type="number"
										id="minStock"
										name="minStock"
										placeholder="0"
										label="Stok Minimum"
										error={errors['minStock']}
										value={input?.minStock}
										onChange={e => {
											setInput({ ...input, minStock: parseInt(e.target.value) })
											setErrors({ ...errors, "minStock": "" });
										}}
									/>
								}
							</div>
						</div>
						<div className="sm:col-span-2">
							<div className="mt-2">
								{isLoading ?
									<InputField
										type="number"
										id="maxStock"
										name="maxStock"
										placeholder="0"
										label="Stok Maksimum"
										value={input?.maxStock}
										disabled={true}
									/>
									:
									<InputField
										type="number"
										id="maxStock"
										name="maxStock"
										placeholder="0"
										label="Stok Maksimum"
										error={errors['maxStock']}
										value={input?.maxStock}
										onChange={e => {
											setInput({ ...input, maxStock: parseInt(e.target.value) })
											setErrors({ ...errors, "maxStock": "" });
										}}
									/>
								}
							</div>
						</div>
						<div className="sm:col-span-3">
							<label htmlFor="genericName" className="block text-sm font-medium leading-6 pt-2 text-dark">
								Nama Generik
							</label>
							<div className="mt-2">
								{isLoading ?
									<SelectPicker
										id="genericName"
										name="genericName"
										placeholder="nama generik"
										size='lg'
										disabled={true}
										value={input?.genericName?.id}
										valueKey="id"
										labelKey="label"
										data={generics}
										block
									/>
									:
									<>
										<SelectPicker
											id="genericName"
											name="genericName"
											placeholder="nama generik"
											size='lg'
											value={input?.genericName?.id}
											valueKey="id"
											labelKey="label"
											onChange={value => {
												setInput({ ...input, genericName: value })
												setErrors({ ...errors, "genericName": "" });
											}}
											data={generics}
											block
										/>
										<div style={{ minHeight: '22px' }}>
											{
												errors['genericName'] &&
												<Text type="danger">{errors['genericName']}</Text>
											}
										</div>
									</>
								}
							</div>
						</div>
						<div className="sm:col-span-3">
							<label htmlFor="packaging" className="block text-sm font-medium leading-6 pt-2 text-dark">
								Kemasan
							</label>
							<div className="mt-2">
								{isLoading ?
									<SelectPicker
										id="packaging"
										name="packaging"
										placeholder="kemasan"
										disabled={true}
										size='lg'
										value={input?.packaging?.id}
										labelKey="label"
										valueKey="id"
										data={packagings}
										block
									/>
									:
									<>
										<SelectPicker
											id="packaging"
											name="packaging"
											placeholder="kemasan"
											value={input?.packaging?.id}
											labelKey="label"
											size='lg'
											valueKey="id"
											onChange={value => {
												setInput({ ...input, packaging: value })
												setErrors({ ...errors, "packaging": "" });
											}}
											data={packagings}
											block
										/>
										<div style={{ minHeight: '22px' }}>
											{
												errors['packaging'] &&
												<Text type="danger">{errors['packaging']}</Text>
											}
										</div>
									</>
								}
							</div>
						</div>
						<div className="sm:col-span-6 my-6">
							{/* <MedicineClassificationForm isLoading={isLoading} formFields={formFields} setFormFields={HandleFormFields} /> */}
							<MedicineClassificationForm isLoading={isLoading} formFields={formFields} setFormFields={handleFormFields} />
						</div>
						<div className="sm:col-span-6">
							<label htmlFor="unitOfMeasure" className="block text-sm font-medium leading-6 text-dark">
								Satuan Ukuran
							</label>
							<div className="mt-2">
								{isLoading ?
									<SelectPicker
										id="unitOfMeasure"
										name="unitOfMeasure"
										placeholder="satuan"
										disabled={true}
										size='lg'
										block
										data={unitOfMeasure}
										value={input?.unitOfMeasure}
										valueKey="value"
										labelKey="label"
									/>
									:
									<>
										<SelectPicker
											id="unitOfMeasure"
											name="unitOfMeasure"
											placeholder="satuan"
											size='lg'
											data={unitOfMeasure}
											block
											onChange={value => {
												setInput({ ...input, unitOfMeasure: value })
												setErrors({ ...errors, "unitOfMeasure": "" });
											}}
											value={input?.unitOfMeasure}
											valueKey="value"
											labelKey="label"
										/>
										<div style={{ minHeight: '22px' }}>
											{
												errors['unitOfMeasure'] &&
												<Text type="danger">{errors['unitOfMeasure']}</Text>
											}
										</div>
									</>
								}
							</div>
						</div>
						<div className="sm:col-span-6">
							<div className="mt-2">
								{isLoading ?
									<InputField
										type="text"
										label="Efek Samping"
										id="sideEffect"
										name="sideEffect"
										placeholder="efek samping"
										value={input?.sideEffect}
										disabled={true}
									/>
									:
									<InputField
										type="text"
										id="sideEffect"
										label="Efek Samping"
										name="sideEffect"
										placeholder="efek samping"
										value={input?.sideEffect}
										error={errors['sideEffect']}
										onChange={e => {
											setInput({ ...input, sideEffect: e.target.value })
											setErrors({ ...errors, "sideEffect": "" });
										}}
									/>
								}
							</div>
						</div>
					</div>

					<div className="flex justify-center gap-2 my-6 lg:justify-end">
						{isLoading ?
							<Button
								appearance="primary"
								isDisabled={true}
								isLoading={isLoading}
							>
								Simpan
							</Button>
							:
							<Button
								isLoading={isLoading}
								type="button"
								appearance="primary"
								onClick={() => {
									handleSubmit();
								}}
							>
								Simpan
							</Button>
						}
					</div>
				</form>
			</ContentLayout>
		</Layout>
	)
}
