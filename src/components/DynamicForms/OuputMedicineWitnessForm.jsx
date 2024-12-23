import propTypes from 'prop-types';
import Button from '../Button';
import { IoIosAdd } from 'react-icons/io';
import { MdDeleteOutline } from 'react-icons/md';
import { SelectPicker } from 'rsuite';
import Text from "@/components/Text";
import Dropdown from '../SelectPicker/Dropdown';
import Input from '../Input';
import { useEffect } from 'react';

export default function OutputMedicineWitnessForm(props) {
	const {
		isLoading,
		formFields,
		setFormFields,
		option,
		disabled,
		errors,
		setErrors,
	} = props;

	const handleChangeFormFields = (name, value, index) => {
		try {
			let data = [...formFields];
			data[index][name] = value;
			setFormFields(data);
		} catch (error) {
			console.error(error);
		}
	}

	const addFormField = () => {
		let field = { name: "", nip: "", role: "" };
		setFormFields([...formFields, field]);
	};

	const removeFormField = (index) => {
		let data = [...formFields];
		data.splice(index, 1);
		setFormFields(data);

		Object.keys(errors).forEach(key => {
			if (key.startsWith("physicalReport.data.witnesses.")) {
				const path = key.split('.')
				const currPathIndex = path[3];
				if (currPathIndex === index.toString()) {
					delete errors[key]
				} else if (currPathIndex > index.toString()) {
					path[3] = (currPathIndex - 1).toString()
					const newKey = path.join('.')
					errors[newKey] = errors[key]
					delete errors[key]
				}
			}
		})
	};

	const handleCheckError = (field) => {
		console.log("field name: ", field);
		console.log("error from component: ", errors);
		if (errors[field]) {
			return errors[field];
		}
		return null;
	}

	return (
		<div id="form-2 w-full">
			<div className="grid grid-cols-1 gap-x-6 gap-y-2 w-full">
				{formFields?.map((form, index) => (
					<div key={index} className='col-span-12 w-full lg:grid lg:grid-cols-11 gap-x-6 text-start'>
						<div className='max-lg:w-full'>
							{index === 0 && (
								<div className="flex text-sm invisible font-medium leading-6 text-gray-900 lg:justify-center">
									.
								</div>
							)}
							<div className="flex flex-col justify-start lg:gap-2">
								{(index === formFields.length - 1) ? 
									<Button className={formFields.length > 1 ? 'mt-2' : null} size="small" onClick={(e) => addFormField()} isDisabled={disabled}>
										<IoIosAdd size={"1.6rem"} />
									</Button>
									: null
								}
							</div>
						</div>

						{/* Nama */}
						<div className="lg:col-span-3">
							{(index === 0) && (
								<label className="block text-body font-medium leading-6 text-gray-900">
									Nama
								</label>
							)
							}
							<div className="mt-2">
								{isLoading ?
									<Input
										id='name'
										name='name'
										placeholder='Nama'
										size='lg'
										className="py-1.5 block"
										disabled={true}
										value={form.name}
									/>
									:
									<>
										<Input
                                            id='name'
                                            name='name'
                                            placeholder='Nama'
                                            size='lg'
                                            className="py-1.5 block"
                                            value={form.name}
                                            block
											onChange={(e) => {
												handleChangeFormFields('name', e.target.value, index)
												setErrors({
													...errors,
													[`physicalReport.data.witnesses.${index}.name`]: ""
												});
											}}
											// error={() => handleCheckError(`physicalReport.data.witnesses[${index}].name`)}
											error={
												errors[`physicalReport.data.witnesses.${index}.name`]
											}
                                        />
										{/* {
											errors[`data[${index}].name`] &&
												<div style={{ minHeight: '22px' }}>
													<Text type="danger">{errors[`data[${index}].name`]}</Text>
												</div>
										} */}
									</>
								}
							</div>
						</div>

						{/* NIP */}
						<div className="lg:col-span-3">
							{(index === 0) && (
								<label className="block text-body font-medium leading-6 text-gray-900">
									Nomor Identitas Pegawai
								</label>
							)
							}
							<div className="mt-2">
								{isLoading ?
									<Input
										id='nip'
										name='nip'
										placeholder='NIP'
										size='lg'
										className="py-1.5"
										disabled={true}
										value={form.nip}
										block
									/>
									:
									<>
										<Input
                                            id='nip'
                                            name='nip'
                                            placeholder='Nip'
                                            size='lg'
                                            className="py-1.5"
                                            value={form.nip}
                                            block
											onChange={(e) => {
												handleChangeFormFields('nip', e.target.value, index)
												setErrors({
													...errors,
													[`physicalReport.data.witnesses.${index}.nip`]: ""
												});
											}}
											error={
												errors[`physicalReport.data.witnesses.${index}.nip`]
											}
											// error={() => handleCheckError(`physicalReport.data.witnesses[${index}].nip`)}
                                        />
										{/* {
											errors["data.nip"] &&
												<div style={{ minHeight: '22px' }}>
													<Text type="danger">{errors["data.nip"]}</Text>
												</div>
										} */}
									</>
								}
							</div>
						</div>

						{/* Jabatan */}
						<div className="lg:col-span-3">
							{(index === 0) && (
								<label className="block text-body font-medium leading-6 text-gray-900">
									Jabatan
								</label>
							)
							}
							<div className="mt-2">
								{isLoading ?
									<Input
										id='role'
										name='role'
										placeholder='Role'
										size='lg'
										className="py-1.5"
										disabled={true}
										value={form.role}
										block
									/>
									:
									<>
										<Input
                                            id='role'
                                            name='role'
                                            placeholder='Role'
                                            size='lg'
                                            className="py-1.5"
                                            value={form.role}
                                            block
											onChange={(e) => {
												handleChangeFormFields('role', e.target.value, index)
												setErrors({
													...errors,
													[`physicalReport.data.witnesses.${index}.role`]: ""
												});
											}}
											error={
												errors[`physicalReport.data.witnesses.${index}.role`]
											}
											// error={() => handleCheckError(`physicalReport.data.witnesses[${index}].role`)}
                                        />
										{/* {
											errors["data.role"] &&
												<div style={{ minHeight: '22px' }}>
													<Text type="danger">{errors["data.role"]}</Text>
												</div>
										} */}
									</>
								}
							</div>
						</div>
						{(disabled === undefined || disabled === null || disabled === false) && (
							<div className="max-lg:col-span-10 col-span-1 lg:w-full">
								{(index === 0) && (
									<label className="flex text-md font-medium leading-6 text-gray-900 lg:justify-center">
										Action
									</label>
								)
								}
								<button
									className={`flex justify-center w-full rounded-md py-2 mt-2 stroke-2 shadow-sm ${formFields.length > 1 ? 'stroke-white' : 'lg:stroke-gray-300 stroke-white'} lg:shadow-none lg:border-0 border-2 border-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
									disabled={formFields?.length > 1 ? false : true}
									onClick={(e) => {
										e.preventDefault();
										removeFormField(index);
									}}
								>
									{/* <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 7.03621L18.1327 19.2412C18.0579 20.2932 17.187 21.1083 16.1378 21.1083H7.86224C6.81296 21.1083 5.94208 20.2932 5.86732 19.2412L5 7.03621M10 11.0568V17.0877M14 11.0568V17.0877M15 7.03621V4.02077C15 3.46564 14.5523 3.01562 14 3.01562H10C9.44772 3.01562 9 3.46564 9 4.02077V7.03621M4 7.03621H20" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg> */}
									<MdDeleteOutline size={"1.6rem"} color="maroon" />
								</button>
							</div>)
						}
					</div>
				))}
			</div>
		</div>
	)
}

OutputMedicineWitnessForm.propTypes = {
	isLoading: propTypes.bool,
	formFields: propTypes.array,
	// setFormFields: propTypes.func,
	// setError: propTypes.func,
	option: propTypes.array,
	disabled: propTypes.bool
}
