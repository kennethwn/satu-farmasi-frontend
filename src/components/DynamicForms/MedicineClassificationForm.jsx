import propTypes from 'prop-types';
import Select from '../Select';
import { useEffect } from 'react';
import Button from '../Button';
import { IoIosAdd } from 'react-icons/io';
import { MdDeleteOutline } from 'react-icons/md';
import { SelectPicker } from 'rsuite';
import Dropdown from '../SelectPicker/Dropdown';

export default function MedicineClassificationForm(props) {
    const {
        isLoading,
        formFields,
        setFormFields,
        setError,
        option,
        disabled
    } = props;

    const classifications = [
        {id: 1, label: 'obat penenang', value: 'obat penenang'},
        {id: 2, label: 'amoxicillin', value: 'amoxicillin'},
        {id: 3, label: 'azithromycin', value: 'azithromycin'},
        {id: 4, label: 'cefalexin', value: 'cefalexin'},
    ]

    const handleChangeFormFields = (value, index) => {
        try {
            console.log(value);
            let data = [...formFields];
            data[index]['id'] = Number(value);
            data[index]['label'] = classifications.find((item) => item.id === Number(value))?.label;
            data[index]['value'] = classifications.find((item) => item.id === Number(value))?.value;
            console.log(data);
            setFormFields(data);
        } catch (error) {
            console.error(error);
        }
    }

    const addFormField = () => {
        let field = {id: 0, label: '', value: ''};
        setFormFields([...formFields, field]);
    };

    const removeFormField = (index) => {
        let data = [...formFields];
        data.splice(index, 1);
        setFormFields(data);
    };

    return (
        <div id="form-2">
            <div className="grid grid-cols-1 w-full gap-x-6 gap-y-2 lg:grid-cols-10">
                {formFields?.map((form, index) => (
                    <div key={index} className='col-span-12 w-full grid lg:grid-cols-12 grid-cols-1 lg:gap-x-6 gap-y-2'>
                        <div className='w-full'>
                            {index === 0 && (
                                <div className="flex text-sm invisible font-medium leading-6 text-gray-900 lg:justify-center">
                                    .
                                </div>
                            )}
                            <div className="flex items-center w-full justify-start mt-2 lg:gap-2">
                                {((disabled === undefined || disabled === null || disabled === false) && (index === formFields.length - 1)) ?
                                    <Button size="small" onClick={(e) => addFormField()}>
                                        <IoIosAdd size={"1.6rem"} />
                                    </Button>
                                    :
                                    <div className='lg:px-6 lg:py-2'></div>
                                }
                            </div>
                        </div>
                        <div className="col-span-10">
                            {(index === 0) && (
                                <label className="block text-sm leading-6 font-medium text-gray-900">
                                    Klasifikasi obat
                                </label>
                            )}
                            <div className="mt-2">
                                {isLoading ?
                                    <Dropdown
                                        id='classification'
                                        name='classification'
                                        placeholder='klasifikasi'
                                        size='lg'
                                        disabled={true}
                                        value={formFields.length == 0 ? 0 :form?.id}
                                        data={classifications}
                                        valueKey='id'
                                        labelKey='label'
                                        block
                                    />
                                    :
                                    <Dropdown 
                                        id='classification'
                                        name='classification'
                                        placeholder='klasifikasi'
                                        block
                                        size='lg'
                                        data={classifications}
                                        value={formFields.length == 0 ? 0 :form?.id}
                                        valueKey='id'
                                        labelKey='label'
                                        onChange={(value) => handleChangeFormFields(value, index)}
                                    />
                                }
                            </div>
                        </div>
                        {(disabled === undefined || disabled === null || disabled === false) && (
                            <div className="">
                                {(index === 0) && (
                                    <label className="flex text-sm leading-6 font-medium text-gray-900 lg:justify-center">
                                        Action
                                    </label>
                                )
                                }
                                <button
                                    // className={`flex justify-center w-full rounded-md py-1.5 stroke-2 shadow-sm ${formFields.length > 1 ? 'lg:stroke-red-500 lg:bg-stone-50 stroke-white bg-red-500' : 'lg:stroke-gray-300 lg:bg-stone-50 stroke-white bg-gray-500'} lg:shadow-none lg:border-0 border-2 border-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                    className={`flex justify-center w-full rounded-md py-2 mt-2 stroke-2 shadow-sm ${formFields.length > 1 ? ' lg:stroke-red-500 lg:bg-white stroke-white bg-background-danger' : 'lg:stroke-gray-300 bg-border-box stroke-white'} lg:shadow-none lg:border-0 border-2 border-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                    disabled={formFields?.length > 1 ? false : true}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log(index);
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