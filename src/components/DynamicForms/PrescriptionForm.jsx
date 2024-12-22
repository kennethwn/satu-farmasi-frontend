import React, { useEffect, useState } from "react";
import InputField from "../Input";
import Button from "../Button";
import { IoIosAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import useMedicineDropdownOption from "@/pages/api/medicineDropdownOption";
import { formatRupiah } from "@/helpers/currency";
import Dropdown from "../SelectPicker/Dropdown";

function PrescriptionForm(props) {
  const { formFields, setFormFields, setAvailableStock = () => {}, errors, setErrors, disabled } = props;

  const { getMedicineDropdownOptions } = useMedicineDropdownOption();
  const [medicineDropdownOptions, setMedicineDropdownOptions] = useState([]);

  const data = Object.entries(medicineDropdownOptions).map(([key, item]) => ({
    label: item.name + " - " + key,
    value: key,
  }));

  useEffect(() => {
    async function fetchMedicineDropdownOptionsData(){
        try {
            const response = await getMedicineDropdownOptions(true, true)
            setAvailableStock(response.data)
            setMedicineDropdownOptions(response.data)
        } catch (error) {
            console.log("error #getMedicineOptions")
        }
    } 
    fetchMedicineDropdownOptionsData();
  }, []);

  const handleMedicineChange = (formFieldId, code) => {
    const checkIfStockIsInsufficient = (medicineDropdownOption, quantity) => {
      return medicineDropdownOption.currStock - quantity < 0
    }

    let updatedData = {
      code: code,
      medicineName: medicineDropdownOptions[code]?.name,
      quantity: 0,
      price: medicineDropdownOptions[code]?.price,
      currStock: medicineDropdownOptions[code]?.currStock,
      reservedStock: medicineDropdownOptions[code]?.reservedStock,
      totalPrice: 0,
      insufficientStock: checkIfStockIsInsufficient(medicineDropdownOptions[code], quantity)
    };
    let temp = [...formFields];

    temp.forEach((item, index) => {
      if (index === formFieldId) {
        item.code = updatedData.code;
        item.medicineName = updatedData.medicineName;
        item.currStock = updatedData.currStock;
        item.reservedStock = updatedData.reservedStock;
        item.quantity = 0;
        item.price = updatedData.price;
        item.totalPrice = 0;
      }
    });

    setFormFields(temp);
  };

  const handleAddFormFieldRow = () => {
    const newFormField = {
      code: "",
      medicineName: "",
      quantity: 0,
      price: 0,
      totalPrice: 0,
      instruction: "",
      insufficientStock: false
    };
    setFormFields([...formFields, newFormField]);
  };

  const handleMedicineQuantity = (formFieldId, quantity) => {
    const code = formFields[formFieldId].code;
    const checkIfStockIsInsufficient = (medicineDropdownOption, quantity) => {
      return medicineDropdownOption.currStock - medicineDropdownOption.reservedStock - quantity < 0
    }

    let updatedData = {
      id: formFieldId,
      code: code,
      medicineName: medicineDropdownOptions[code] && medicineDropdownOptions[code].name,
      quantity: quantity,
      price: medicineDropdownOptions[code] ? medicineDropdownOptions[code].price : 0,
      totalPrice: medicineDropdownOptions[code] ? medicineDropdownOptions[code].price * quantity : 0,
      insufficientStock: medicineDropdownOptions[code] && checkIfStockIsInsufficient(medicineDropdownOptions[code], quantity)
    };
    let temp = [...formFields];

    temp.forEach((item, index) => {
      if (index === formFieldId) {
        item.code = updatedData.code;
        item.medicineName = updatedData.medicineName;
        item.quantity = updatedData.quantity;
        item.price = updatedData.price;
        item.totalPrice = updatedData.totalPrice;
        item.insufficientStock = updatedData.insufficientStock
      }
    });

        setFormFields(temp);
    };

    const handleRemoveFormFieldRow = (formFieldId) => {
        if (formFields.length > 1) {
            setFormFields((formFields) =>
                formFields.filter((formField, index) => index !== formFieldId),
            );
        }
    };

    const handleInstructionField = (formFieldId, instruction) => {
        const temp = [...formFields];
        temp.forEach((item, index) => {
            if (index === formFieldId) {
                item.instruction = instruction;
            }
        });
        setFormFields(temp);
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="grid grid-cols-10 gap-4 text-center font-bold max-lg:invisible">
                <div> </div>
                <div className="col-span-2">Nama Obat</div>
                <div className="col-span-1">Jumlah</div>
                <div className="col-span-1">Stock Obat</div>
                <div className="col-span-2">Harga per Obat</div>
                <div className="col-span-2">Total Sub Harga</div>
                <div> Aksi </div>
            </div>
            {formFields &&
                formFields.map((formField, index) => (
                    <div className="flex flex-col gap-2">
                        <div
                            key={index}
                            className="grid grid-cols-1 w-full lg:grid-cols-10 gap-4 mb-2"
                        >
                            <div className="flex lg:flex-col w-3/4">
                                {index == formFields.length - 1 && (
                                    <Button
                                        size="small"
                                        onClick={(e) => handleAddFormFieldRow()}
                                        isDisabled={disabled}
                                    >
                                        <IoIosAdd size={"1.6rem"} />
                                    </Button>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label className="lg:hidden">Nama Obat</label>
                                <Dropdown
                                    id="name"
                                    size="lg"
                                    name="name"
                                    data={data}
                                    onChange={(value) => {
                                        handleMedicineChange(index, value);
                                        setErrors({
                                            ...errors,
                                            [`prescription.medicineList.${index}.code`]:
                                                "",
                                        });
                                    }}
                                    value={formField.code}
                                    block
                                    style={{}}
                                    placement="bottomStart"
                                    cleanable={false}
                                    error={
                                        errors[
                                        `prescription.medicineList.${index}.code`
                                        ]
                                    }
                                    disabled={disabled}
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="lg:hidden">Jumlah</label>
                                <InputField
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    placeholder="Jumlah"
                                    value={formField.quantity}
                                    disabled={formField.code == -1 || disabled}
                                    onChange={(e) => {
                                        handleMedicineQuantity(
                                            index,
                                            e.target.value,
                                        );
                                        setErrors({
                                            ...errors,
                                            [`prescription.medicineList.${index}.quantity`]:
                                                "",
                                        });
                                    }}
                                    error={
                                        errors[
                                        `prescription.medicineList.${index}.quantity`
                                        ]
                                    }
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="lg:hidden"> Stock Obat </label>
                                <InputField
                                    type="number"
                                    id="currStock"
                                    name="currStock"
                                    placeholder="Stock Obat"
                                    value={formField.currStock - formField.reservedStock ||
                                        formField.currStock - formField.quantity
                                    }
                                    disabled={true}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="lg:hidden">
                                    Harga per Obat
                                </label>
                                <InputField
                                    type="text"
                                    id="price"
                                    name="price"
                                    placeholder="Harga Obat"
                                    value={formatRupiah(formField.price)}
                                    disabled
                                    currency="true"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="lg:hidden">
                                    Total Sub Harga
                                </label>
                                <InputField
                                    type="text"
                                    id="subtotal"
                                    name="subtotal"
                                    placeholder="Total Harga Obat"
                                    value={formatRupiah(formField.totalPrice)}
                                    disabled
                                    currency="true"
                                />
                            </div>
                            <div className="col-span-2 lg:hidden">
                                <label className="lg:hidden">Instruction</label>
                                <InputField
                                    type="text"
                                    id="instruction"
                                    name="instruction"
                                    value={formField?.instruction} // TODO: fix handle change
                                    placeholder="Instruksi"
                                    disabled={disabled}
                                    onChange={(e) => {
                                        handleInstructionField(
                                            index,
                                            e.target.value,
                                        );
                                        setErrors({
                                            ...errors,
                                            [`prescription.medicineList.${index}.instruction`]:
                                                "",
                                        });
                                    }}
                                    error={
                                        errors[
                                        `prescription.medicineList.${index}.instruction`
                                        ]
                                    }
                                />
                            </div>
                            <div className="max-lg:col-span-2 justify-center lg:flex lg:flex-col lg:justify-end">
                                <button
                                    className={`flex justify-center w-full rounded-md py-2 stroke-2 shadow-sm ${formFields.length > 1 ? "stroke-white bg-button-danger lg:bg-white" : "lg:stroke-gray-300 stroke-white"} lg:shadow-none lg:border-0 border-2 border-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                    disabled={
                                        formFields?.length > 1 ? false : true
                                        || disabled
                                    }
                                    onClick={(e) =>
                                        handleRemoveFormFieldRow(index)
                                    }
                                >
                                    <MdDeleteOutline
                                        size={"1.6rem"}
                                        color="maroon"
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-10 max-lg:hidden max-lg:grid-cols-1 w-full gap-4 mb-6">
                            <div className="col-span-1 max-lg:hidden"></div>
                            <div className="lg:col-span-8 col-span-1 w-full">
                                <InputField
                                    type="text"
                                    id="instruction"
                                    name="instruction"
                                    value={formField?.instruction} // TODO: fix handle change
                                    placeholder="Instruksi"
                                    onChange={(e) => {
                                        handleInstructionField(
                                            index,
                                            e.target.value,
                                        );
                                        setErrors({
                                            ...errors,
                                            [`prescription.medicineList.${index}.instruction`]:
                                                "",
                                        });
                                    }}
                                    error={
                                        errors[
                                        `prescription.medicineList.${index}.instruction`
                                        ]
                                    }
                                    disabled={disabled}
                                />
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default PrescriptionForm;
