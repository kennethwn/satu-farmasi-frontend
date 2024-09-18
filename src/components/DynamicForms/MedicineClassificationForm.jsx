import propTypes from 'prop-types';
import Select from '../Select';
import { useEffect } from 'react';
import Button from '../Button';
import { IoIosAdd } from 'react-icons/io';
import { MdDeleteOutline } from 'react-icons/md';

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

    const handleChangeFormFields = (e, index) => {
        try {
            let data = [...formFields];
            data[index]['id'] = Number(e.target.value);
            data[index]['label'] = classifications.find((item) => item.id === Number(e.target.value))?.label;
            data[index]['value'] = classifications.find((item) => item.id === Number(e.target.value))?.value;
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
            <div className="grid grid-cols-1 gap-x-6 gap-y-2">
                {formFields?.map((form, index) => (
                    <div key={index} className='col-span-12 grid grid-cols-12 gap-x-6'>
                        <div className=''>
                            {index === 0 && (
                                <label className="flex text-sm text-white font-medium leading-6 text-gray-900 lg:justify-center">
                                    No
                                </label>
                            )}
                            <div className="flex items-center justify-start mt-1 lg:gap-2">
                                {((disabled === undefined || disabled === null || disabled === false) && (index === formFields.length - 1)) ?
                                    (<button className=""
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addFormField();
                                        }}>

                                        <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.554688" width="39.3168" height="38" rx="5" fill="#E5E7EB" />
                                            <path d="M20.2128 12V24M26.4207 18L14.0049 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>)
                                    // <Button onClick={(e) => {
                                    //     addFormField();
                                    // }}>
                                    //     <IoIosAdd size={"1.3rem"} />
                                    // </Button>
                                    :
                                    <div className='lg:px-6 lg:py-2'></div>
                                }
                                {/* <p className={`${index < formFields.length - 1 ? 'lg:mx-auto' : 'lg:ml-[1px]'}`}>{index + 1}</p> */}
                            </div>
                        </div>
                        <div className="col-span-10">
                            {(index === 0) && (
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Klasifikasi obat
                                </label>
                            )
                            }
                            <div className="mt-2">
                                {isLoading ?
                                    <Select 
                                        id='classification'
                                        name='classification'
                                        placeholder='klasifikasi'
                                        disabled={true}
                                        value={formFields.length == 0 ? 0 :form?.id}
                                        options={classifications}
                                    />
                                    :
                                    <Select 
                                        id='classification'
                                        name='classification'
                                        placeholder='klasifikasi'
                                        options={classifications}
                                        value={formFields.length == 0 ? 0 :form?.id}
                                        onChange={(e) => handleChangeFormFields(e, index)}
                                    />
                                }
                            </div>
                        </div>
                        {(disabled === undefined || disabled === null || disabled === false) && (
                            <div className="">
                                {(index === 0) && (
                                    <label className="flex text-sm font-medium leading-6 text-gray-900 lg:justify-center">
                                        Action
                                    </label>
                                )
                                }
                                <button
                                    className={`flex justify-center w-full rounded-md py-1.5 mt-2 stroke-2 shadow-sm ${formFields.length > 1 ? 'lg:stroke-red-500 lg:bg-stone-50 stroke-white bg-red-500' : 'lg:stroke-gray-300 lg:bg-stone-50 stroke-white bg-gray-500'} lg:shadow-none lg:border-0 border-2 border-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
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
                                {/* <Button
                                    type="button"
                                    appearance='danger'
                                    id="action"
                                    name="action"
                                    placeholder="action"
                                    size="medium"
                                    disabled={formFields?.length > 1 ? false : true}
                                    onClick={(e) => removeFormField(index)}
                                >
                                    <MdDeleteOutline size={"1.6rem"} color="maroon" />
                                </Button> */}
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