import React, { useState } from "react";
import { IoIosAdd } from 'react-icons/io';
import Button from "../Button";
import propTypes, { object } from 'prop-types';
import Input from "../Input";
import { MdDeleteOutline } from "react-icons/md";

export default function RequestDynamicMedicineForm(props) {
    const { disabled, formFields, setFormFields, errors, setErrors } = props;

    const handleChange = (fieldName, value, index) => {
        try {
            let data = [...formFields];
            data[index][fieldName] = value;
            setFormFields(data);
        } catch (error) {
            console.error(error);
        }
    }

    const addFormField = () => {
		let field = { medicine: "", quantity: 0, remark: "" };
		setFormFields([...formFields, field]);
	};

    const removeFields = (index) => {
        let data = [...formFields];
        data.splice(index, 1);
        setFormFields(data);

        Object.keys(errors).forEach(key => {
            const path = key.split('.')
            const currPathIndex = path[1];
            if (currPathIndex === index.toString()) {
                delete errors[key]
            } else if (currPathIndex > index.toString()) {
                path[1] = (currPathIndex - 1).toString()
                const newKey = path.join('.')
                errors[newKey] = errors[key]
                delete errors[key]
            }
		})
    }

    return (
        <div className="w-full pb-4">
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 w-full lg:grid-cols-[repeat(11,minmax(0,1fr))]">
                {formFields?.map((form, index) => {
                    return (
                        <React.Fragment key={index}>
                            {/* CTA Add Button */} 
                            <div className="flex flex-col lg:gap-2">
                                {index == 0 && (
                                    <label className="invisible">No</label>
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

                            {/* Nama Sediaan Farmasi */}
                            <div className="lg:col-span-3">
                                {index == 0 && (<label>Nama Sediaan Farmasi</label>)}
                                <div className="mt-2">
                                    <Input
                                        className="block"
                                        value={form?.medicine}
                                        placeholder="obat"
                                        onChange={(e) => {
                                            handleChange("medicine", e.target.value, index)
                                            setErrors({...errors, 
                                                [`medicines.${index}.medicine`]: ''
                                            });
                                        }}
                                        error={errors[`medicines.${index}.medicine`]}
                                    />
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="lg:col-span-3">
                                {index == 0 && (<label>Jumlah</label>)}
                                <div className="mt-2">
                                    <Input
                                        className="block"
                                        value={form?.quantity}
                                        type="number"
                                        placeholder="0"
                                        onChange={(e) => {
                                            handleChange("quantity", parseInt(e.target.value), index)
                                            setErrors({...errors, 
                                                [`medicines.${index}.quantity`]: ''
                                            });
                                        }}
                                        error={errors[`medicines.${index}.quantity`]}
                                    />
                                </div>
                            </div>

                            {/* Keterangan */}
                            <div className="lg:col-span-3">
                                {index == 0 && (<label>Keterangan</label>)}
                                <div className="mt-2">
                                    <Input
                                        className="block"
                                        value={form?.remark}
                                        placeholder="keterangan"
                                        onChange={(e) => {
                                            handleChange("remark", e.target.value, index)
                                            setErrors({...errors, 
                                                [`medicines.${index}.remark`]: ''
                                            });
                                        }} 
                                        error={errors[`medicines.${index}.remark`]}
                                    />
                                </div>
                            </div>

                            {/* CTA Remove Button */}
                            {/* {(disabled === undefined || disabled === null || disabled === false) && ( */}
                                <div className="">
                                    {(index === 0) && (
                                        <label className="flex text-sm font-medium leading-6 text-gray-900 lg:justify-center">
                                            Action
                                        </label>
                                    )
                                    }
                                    <button
                                        className={`flex justify-center w-full rounded-md py-1.5 mt-1 stroke-2 shadow-sm ${formFields?.length > 1 ? 'stroke-white bg-button-danger lg:bg-white' : 'lg:stroke-gray-300 stroke-white'} lg:shadow-none lg:border-0 border-2 border-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                        disabled={(formFields?.length > 1 ? false : true) || disabled}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFields(index);
                                        }}
                                    >
                                        <MdDeleteOutline size={"1.6rem"} color="maroon" />
                                    </button>
                                </div>
                            {/* )} */}
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}

RequestDynamicMedicineForm.propTypes = {
    disabled: propTypes.bool,
    formFields: propTypes.arrayOf(object),
    setFormFields: propTypes.func
}