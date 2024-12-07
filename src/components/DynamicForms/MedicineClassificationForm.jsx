import propTypes from 'prop-types';
import Button from '../Button';
import { IoIosAdd } from 'react-icons/io';
import { MdDeleteOutline } from 'react-icons/md';
import { SelectPicker } from 'rsuite';
import Text from "@/components/Text";
import Dropdown from '../SelectPicker/Dropdown';

export default function MedicineClassificationForm(props) {
	const {
		isLoading,
		formFields,
		setFormFields,
		setError,
		option,
		disabled,
		errors,
		setErrors,
		classifications,
	} = props;

	const handleChangeFormFields = (value, index) => {
		try {
			let data = [...formFields];
			data[index]['id'] = Number(value);
			data[index]['label'] = classifications.find((item) => item.id === Number(value))?.label;
			data[index]['value'] = classifications.find((item) => item.id === Number(value))?.value;
			setFormFields(data);
		} catch (error) {
			console.error(error);
		}
	}

	const addFormField = () => {
		let field = { id: 0, label: '', value: '' };
		setFormFields([...formFields, field]);
	};

	const removeFormField = (index) => {
		let data = [...formFields];
		data.splice(index, 1);
		setFormFields(data);
	};

	return (
		<div id="form-2">
			<div className="grid grid-cols-1 w-full gap-x-6 gap-y-2">
				{formFields?.map((form, index) => (
					<div key={index} className='col-span-12 w-full grid lg:grid-cols-12 gap-x-6'>
						<div className='max-lg:w-full'>
							{index === 0 && (
								<div className="flex text-sm invisible font-medium leading-6 text-gray-900 lg:justify-center">
									.
								</div>
							)}
							<div className="flex items-center w-full justify-start lg:mt-4 lg:gap-2">
								{((index === formFields.length - 1)) ?
									<Button size="small" onClick={(e) => addFormField()} isDisabled={disabled}>
										<IoIosAdd size={"1.6rem"} />
									</Button>
									:
									<div className='lg:px-6 lg:py-2'></div>
								}
								{/* <p className={`${index < formFields.length - 1 ? 'lg:mx-auto' : 'lg:ml-[1px]'}`}>{index + 1}</p> */}
							</div>
						</div>
						<div className="col-span-10">
							{(index === 0) && (
								<label className="block text-body font-medium leading-6 text-gray-900">
									Klasifikasi obat
								</label>
							)
							}
							<div className="mt-2">
								{isLoading ?
									<Dropdown
										id='classification'
										name='classification'
										placeholder='Klasifikasi'
										size='lg'
										className="py-1.5"
										disabled={true}
										value={formFields.length == 0 ? 0 : form?.id}
										data={classifications}
										valueKey='id'
										labelKey='label'
										block
										cleanable={false}
									/>
									:
									<>
										<Dropdown
											id='classification'
											name='classification'
											placeholder='Klasifikasi'
											block
											size='lg'
											className="py-1.5"
											data={classifications}
											value={formFields.length == 0 ? 0 : form?.id}
											valueKey='id'
											labelKey='label'
											disabled={disabled}
											onChange={(value) => {
												handleChangeFormFields(value, index)
												setErrors({
													...errors,
													[`classificationList[${index}]`]: ""
												});
											}}
											cleanable={false}
										/>
										{
											errors[`classificationList[${index}]`] &&
												<div style={{ minHeight: '22px' }}>
													<Text type="danger">{errors[`classificationList[${index}]`]}</Text>
												</div>
										}
									</>
								}
							</div>
						</div>
						{(disabled === undefined || disabled === null || disabled === false) && (
							<div className="max-lg:col-span-10 lg:w-full">
								{(index === 0) && (
									<label className="flex text-md font-medium leading-6 text-gray-900 lg:justify-center">
										Action
									</label>
								)
								}
								<button
									className={`flex justify-center w-full rounded-md py-2 lg:mt-3 stroke-2 shadow-sm ${formFields.length > 1 ? 'stroke-white' : 'lg:stroke-gray-300 stroke-white'} lg:shadow-none lg:border-0 border-2 border-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
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

MedicineClassificationForm.propTypes = {
	isLoading: propTypes.bool,
	formFields: propTypes.array,
	// setFormFields: propTypes.func,
	// setError: propTypes.func,
	option: propTypes.array,
	disabled: propTypes.bool
}
